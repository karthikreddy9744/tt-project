package com.studygroup.controller;

import com.studygroup.dto.DiscussionDTOs;
import com.studygroup.dto.ReplyDTOs;
import com.studygroup.service.DiscussionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/groups/{groupId}/discussions")
public class DiscussionController {

    @Autowired
    private DiscussionService discussionService;

    @PostMapping
    public ResponseEntity<DiscussionDTOs.DiscussionResponse> createDiscussion(
            @PathVariable Long groupId,
            @Valid @RequestBody DiscussionDTOs.CreateDiscussionRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(discussionService.createDiscussion(groupId, request, authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<Page<DiscussionDTOs.DiscussionResponse>> getDiscussions(
            @PathVariable Long groupId,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Boolean isSolved,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        return ResponseEntity.ok(discussionService.getDiscussions(groupId, query, isSolved, page, size, authentication.getName()));
    }

    @GetMapping("/{discussionId}")
    public ResponseEntity<DiscussionDTOs.DiscussionDetailResponse> getDiscussionDetails(
            @PathVariable Long groupId,
            @PathVariable Long discussionId,
            Authentication authentication) {
        return ResponseEntity.ok(discussionService.getDiscussionDetails(groupId, discussionId, authentication.getName()));
    }

    @DeleteMapping("/{discussionId}")
    public ResponseEntity<?> deleteDiscussion(
            @PathVariable Long groupId,
            @PathVariable Long discussionId,
            Authentication authentication) {
        discussionService.deleteDiscussion(groupId, discussionId, authentication.getName());
        return ResponseEntity.ok(Map.of("message", "Discussion deleted successfully"));
    }

    @PostMapping("/{discussionId}/vote")
    public ResponseEntity<DiscussionDTOs.DiscussionResponse> voteDiscussion(
            @PathVariable Long groupId,
            @PathVariable Long discussionId,
            @Valid @RequestBody DiscussionDTOs.VoteRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(discussionService.voteDiscussion(groupId, discussionId, request, authentication.getName()));
    }

    // Replies

    @PostMapping("/{discussionId}/replies")
    public ResponseEntity<ReplyDTOs.ReplyResponse> addReply(
            @PathVariable Long groupId,
            @PathVariable Long discussionId,
            @Valid @RequestBody ReplyDTOs.CreateReplyRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(discussionService.addReply(groupId, discussionId, request, authentication.getName()));
    }

    @PutMapping("/{discussionId}/replies/{replyId}/accept")
    public ResponseEntity<ReplyDTOs.ReplyResponse> acceptReply(
            @PathVariable Long groupId,
            @PathVariable Long discussionId,
            @PathVariable Long replyId,
            Authentication authentication) {
        return ResponseEntity.ok(discussionService.acceptReply(groupId, discussionId, replyId, authentication.getName()));
    }

    @DeleteMapping("/{discussionId}/replies/{replyId}")
    public ResponseEntity<?> deleteReply(
            @PathVariable Long groupId,
            @PathVariable Long discussionId,
            @PathVariable Long replyId,
            Authentication authentication) {
        discussionService.deleteReply(groupId, discussionId, replyId, authentication.getName());
        return ResponseEntity.ok(Map.of("message", "Reply deleted successfully"));
    }
}
