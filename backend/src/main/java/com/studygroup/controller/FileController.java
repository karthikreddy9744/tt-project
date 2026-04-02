package com.studygroup.controller;

import com.studygroup.dto.FileDTOs;
import com.studygroup.service.FileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/groups/{groupId}/files")
public class FileController {

    @Autowired
    private FileService fileService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FileDTOs.FileResponse> uploadFile(
            @PathVariable Long groupId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "topic", required = false) String topic,
            Authentication authentication) {
        return ResponseEntity.ok(fileService.uploadFile(groupId, file, topic, authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<Page<FileDTOs.FileResponse>> getFiles(
            @PathVariable Long groupId,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String topic,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        return ResponseEntity.ok(fileService.getFiles(groupId, query, topic, page, size, authentication.getName()));
    }

    @GetMapping("/{fileId}/download")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable Long groupId,
            @PathVariable Long fileId,
            Authentication authentication) {
        Resource resource = fileService.loadFileAsResource(groupId, fileId, authentication.getName());
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<?> deleteFile(
            @PathVariable Long groupId,
            @PathVariable Long fileId,
            Authentication authentication) {
        fileService.deleteFile(groupId, fileId, authentication.getName());
        return ResponseEntity.ok(Map.of("message", "File deleted successfully"));
    }

    @PostMapping("/{fileId}/vote")
    public ResponseEntity<FileDTOs.FileResponse> voteFile(
            @PathVariable Long groupId,
            @PathVariable Long fileId,
            @Valid @RequestBody FileDTOs.VoteRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(fileService.voteFile(groupId, fileId, request, authentication.getName()));
    }
}
