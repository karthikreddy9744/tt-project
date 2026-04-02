package com.studygroup.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDateTime;

public class ReplyDTOs {

    @Data
    public static class CreateReplyRequest {
        @NotBlank(message = "Content is required")
        @Size(min = 5)
        private String content;
    }

    @Data
    public static class ReplyResponse {
        private Long id;
        private UserDTOs.UserSummary author;
        private String content;
        private Integer upvotes;
        private Boolean isAccepted;
        private LocalDateTime createdAt;
    }
}
