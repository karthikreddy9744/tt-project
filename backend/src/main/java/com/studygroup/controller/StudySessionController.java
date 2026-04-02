package com.studygroup.controller;

import com.studygroup.dto.SessionDTOs;
import com.studygroup.service.StudySessionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/groups/{groupId}/sessions")
public class StudySessionController {

    @Autowired
    private StudySessionService sessionService;

    @PostMapping
    public ResponseEntity<SessionDTOs.SessionResponse> createSession(
            @PathVariable Long groupId,
            @Valid @RequestBody SessionDTOs.CreateSessionRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(sessionService.createSession(groupId, request, authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<List<SessionDTOs.SessionResponse>> getAllSessions(
            @PathVariable Long groupId,
            Authentication authentication) {
        return ResponseEntity.ok(sessionService.getAllSessions(groupId, authentication.getName()));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<SessionDTOs.SessionResponse>> getUpcomingSessions(
            @PathVariable Long groupId,
            Authentication authentication) {
        return ResponseEntity.ok(sessionService.getUpcomingSessions(groupId, authentication.getName()));
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<SessionDTOs.SessionResponse> getSessionDetails(
            @PathVariable Long groupId,
            @PathVariable Long sessionId,
            Authentication authentication) {
        return ResponseEntity.ok(sessionService.getSessionDetails(groupId, sessionId, authentication.getName()));
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<?> deleteSession(
            @PathVariable Long groupId,
            @PathVariable Long sessionId,
            Authentication authentication) {
        sessionService.deleteSession(groupId, sessionId, authentication.getName());
        return ResponseEntity.ok(Map.of("message", "Session deleted successfully"));
    }
}
