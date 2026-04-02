package com.studygroup.service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.studygroup.dto.FileDTOs;
import com.studygroup.entity.FileEntity;
import com.studygroup.entity.GroupMember;
import com.studygroup.entity.StudyGroup;
import com.studygroup.entity.User;
import com.studygroup.exception.ResourceNotFoundException;
import com.studygroup.repository.FileRepository;
import com.studygroup.repository.UserRepository;

import jakarta.annotation.PostConstruct;

@Service
@Transactional
public class FileService {

    @Autowired private FileRepository fileRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private StudyGroupService studyGroupService;
    @Autowired private UserService userService;

    @Value("${app.upload.dir}")
    private String uploadDir;

    private Path fileStorageLocation;

    @PostConstruct
    public void init() {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException | SecurityException ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public FileDTOs.FileResponse uploadFile(Long groupId, MultipartFile file, String topic, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        
        GroupMember member = studyGroupService.verifyGroupMembership(groupId, email);
        StudyGroup group = member.getGroup();

        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileName = UUID.randomUUID().toString() + "_" + originalFileName;

        try {
            if (fileName.contains("..")) {
                throw new com.studygroup.exception.BadRequestException("Sorry! Filename contains invalid path sequence " + fileName);
            }

            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            FileEntity fileEntity = FileEntity.builder()
                    .fileName(originalFileName)
                    .filePath(fileName)
                    .fileType(file.getContentType())
                    .fileSize(file.getSize())
                    .uploadedBy(user)
                    .group(group)
                    .topic(topic)
                    .build();

            fileEntity = fileRepository.save(fileEntity);
            return mapToFileResponse(fileEntity);
        } catch (IOException ex) {
            throw new com.studygroup.exception.BadRequestException("Could not store file " + fileName + ". Please try again!");
        }
    }

    public Page<FileDTOs.FileResponse> getFiles(Long groupId, String query, String topic, int page, int size, String email) {
        studyGroupService.verifyGroupMembership(groupId, email);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("uploadedAt").descending());
        Page<FileEntity> filesPage;

        if (query != null && !query.trim().isEmpty()) {
            filesPage = fileRepository.searchInGroup(groupId, query.trim(), pageable);
        } else if (topic != null && !topic.trim().isEmpty()) {
            filesPage = fileRepository.findByGroupIdAndTopic(groupId, topic.trim(), pageable);
        } else {
            filesPage = fileRepository.findByGroupId(groupId, pageable);
        }

        return filesPage.map(this::mapToFileResponse);
    }

    public Resource loadFileAsResource(Long groupId, Long fileId, String email) {
        studyGroupService.verifyGroupMembership(groupId, email);
        
        FileEntity fileEntity = fileRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("File not found with id " + fileId));

        if (!fileEntity.getGroup().getId().equals(groupId)) {
            throw new com.studygroup.exception.BadRequestException("File does not belong to this group");
        }

        try {
            Path filePath = this.fileStorageLocation.resolve(fileEntity.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File not found " + fileEntity.getFileName());
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("File not found " + fileEntity.getFileName(), ex);
        }
    }

    public void deleteFile(Long groupId, Long fileId, String email) {
        GroupMember member = studyGroupService.verifyGroupMembership(groupId, email);
        
        FileEntity fileEntity = fileRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("File not found with id " + fileId));

        if (!fileEntity.getGroup().getId().equals(groupId)) {
            throw new com.studygroup.exception.BadRequestException("File does not belong to this group");
        }

        // Only uploader, mod, or admin can delete
        if (!fileEntity.getUploadedBy().getEmail().equals(email) && 
            member.getRole() == GroupMember.GroupRole.MEMBER) {
            throw new com.studygroup.exception.AccessDeniedException("You don't have permission to delete this file");
        }

        try {
            Path filePath = this.fileStorageLocation.resolve(fileEntity.getFilePath()).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            // Log error, but still delete from DB
        }

        fileRepository.delete(fileEntity);
    }

    public FileDTOs.FileResponse voteFile(Long groupId, Long fileId, FileDTOs.VoteRequest request, String email) {
        studyGroupService.verifyGroupMembership(groupId, email);
        
        FileEntity file = fileRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("File not found with id " + fileId));

        if (!file.getGroup().getId().equals(groupId)) {
            throw new com.studygroup.exception.BadRequestException("File does not belong to this group");
        }

        if ("UPVOTE".equalsIgnoreCase(request.getVoteType())) {
            file.setUpvotes(file.getUpvotes() + 1);
        } else if ("DOWNVOTE".equalsIgnoreCase(request.getVoteType())) {
            file.setDownvotes(file.getDownvotes() + 1);
        } else {
            throw new com.studygroup.exception.BadRequestException("Invalid vote type");
        }

        file = fileRepository.save(file);
        return mapToFileResponse(file);
    }

    public FileDTOs.FileResponse mapToFileResponse(FileEntity fileEntity) {
        FileDTOs.FileResponse response = new FileDTOs.FileResponse();
        response.setId(fileEntity.getId());
        response.setFileName(fileEntity.getFileName());
        response.setFileType(fileEntity.getFileType());
        response.setFileSize(fileEntity.getFileSize());
        response.setTopic(fileEntity.getTopic());
        response.setUpvotes(fileEntity.getUpvotes());
        response.setDownvotes(fileEntity.getDownvotes());
        response.setUploadedBy(userService.mapToSummary(fileEntity.getUploadedBy()));
        response.setUploadedAt(fileEntity.getUploadedAt());
        return response;
    }
}
