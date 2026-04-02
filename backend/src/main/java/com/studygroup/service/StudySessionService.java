package com.studygroup.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.studygroup.dto.SessionDTOs;
import com.studygroup.entity.GroupMember;
import com.studygroup.entity.StudySession;
import com.studygroup.entity.User;
import com.studygroup.exception.BadRequestException;
import com.studygroup.exception.ResourceNotFoundException;
import com.studygroup.repository.StudySessionRepository;
import com.studygroup.repository.UserRepository;

@Service
@Transactional
public class StudySessionService {

    @Autowired private StudySessionRepository sessionRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private StudyGroupService studyGroupService;
    @Autowired private UserService userService;

    public SessionDTOs.SessionResponse createSession(Long groupId, SessionDTOs.CreateSessionRequest request, String email) {
        User user = getUserByEmail(email);
        GroupMember member = studyGroupService.verifyGroupMembership(groupId, email);

        if (request.getStartTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Start time cannot be in the past");
        }
        if (request.getEndTime() != null && request.getEndTime().isBefore(request.getStartTime())) {
            throw new BadRequestException("End time cannot be before start time");
        }

        // Generate a random, unique Jitsi link based on the group name and a UUID
        String normalizedGroupName = member.getGroup().getName().replaceAll("[^a-zA-Z0-9]", "-").toLowerCase();
        String roomName = "studygroup-" + normalizedGroupName + "-" + UUID.randomUUID().toString().substring(0, 8);
        String jitsiLink = "https://meet.jit.si/" + roomName;

        StudySession session = StudySession.builder()
                .title(request.getTitle().trim())
                .group(member.getGroup())
                .organizer(user)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .description(request.getDescription())
                .jitsiLink(jitsiLink)
                .build();

        session = sessionRepository.save(session);
        return mapToResponse(session);
    }

    public List<SessionDTOs.SessionResponse> getUpcomingSessions(Long groupId, String email) {
        studyGroupService.verifyGroupMembership(groupId, email);
        
        // Find sessions starting after now, ordered by start time
        List<StudySession> sessions = sessionRepository.findByGroupIdAndStartTimeAfterOrderByStartTimeAsc(groupId, LocalDateTime.now());
        
        return sessions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<SessionDTOs.SessionResponse> getAllSessions(Long groupId, String email) {
        studyGroupService.verifyGroupMembership(groupId, email);
        
        return sessionRepository.findByGroupIdOrderByStartTimeAsc(groupId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public SessionDTOs.SessionResponse getSessionDetails(Long groupId, Long sessionId, String email) {
        studyGroupService.verifyGroupMembership(groupId, email);
        
        StudySession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with id " + sessionId));

        if (!session.getGroup().getId().equals(groupId)) {
            throw new BadRequestException("Session does not belong to this group");
        }

        return mapToResponse(session);
    }

    public void deleteSession(Long groupId, Long sessionId, String email) {
        GroupMember member = studyGroupService.verifyGroupMembership(groupId, email);
        
        StudySession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with id " + sessionId));

        if (!session.getGroup().getId().equals(groupId)) {
            throw new BadRequestException("Session does not belong to this group");
        }

        if (!session.getOrganizer().getEmail().equals(email) && 
            member.getRole() == GroupMember.GroupRole.MEMBER) {
             throw new com.studygroup.exception.AccessDeniedException("You don't have permission to delete this session");
        }

        sessionRepository.delete(session);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    private SessionDTOs.SessionResponse mapToResponse(StudySession session) {
        SessionDTOs.SessionResponse response = new SessionDTOs.SessionResponse();
        response.setId(session.getId());
        response.setTitle(session.getTitle());
        response.setOrganizer(userService.mapToSummary(session.getOrganizer()));
        response.setStartTime(session.getStartTime());
        response.setEndTime(session.getEndTime());
        response.setJitsiLink(session.getJitsiLink());
        response.setDescription(session.getDescription());
        response.setCreatedAt(session.getCreatedAt());
        return response;
    }
}
