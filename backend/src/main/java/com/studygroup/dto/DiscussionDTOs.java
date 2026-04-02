package com.studygroup.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

public class DiscussionDTOs {

    @Data
    public static class CreateDiscussionRequest {
        @NotBlank(message = "Title is required")
        @Size(min = 5, max = 300)
        private String title;

        @NotBlank(message = "Content is required")
        @Size(min = 10)
        private String content;

        private Boolean isAnonymous = false;
    }

    @Data
    public static class DiscussionResponse {
        private Long id;
        private String title;
        private String content;
        private UserDTOs.UserSummary author;
        private Boolean isAnonymous;
        private Boolean isSolved;
        private Integer upvotes;
        private Long replyCount;
        private LocalDateTime createdAt;
    }

    @Data
    public static class DiscussionDetailResponse {
        private Long id;
        private String title;
        private String content;
        private UserDTOs.UserSummary author;
        private Boolean isAnonymous;
        private Boolean isSolved;
        private Integer upvotes;
        private List<ReplyDTOs.ReplyResponse> replies;
        private LocalDateTime createdAt;
    }

    @Data
    public static class VoteRequest {
        private String voteType; // "UPVOTE"
    }
}
