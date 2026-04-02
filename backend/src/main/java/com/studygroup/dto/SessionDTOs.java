package com.studygroup.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

public class SessionDTOs {

    @Data
    public static class CreateSessionRequest {
        @NotBlank(message = "Title is required")
        private String title;

        @NotNull(message = "Start time is required")
        private LocalDateTime startTime;

        private LocalDateTime endTime;

        private String description;
    }

    @Data
    public static class SessionResponse {
        private Long id;
        private String title;
        private UserDTOs.UserSummary organizer;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private String jitsiLink;
        private String description;
        private LocalDateTime createdAt;
    }
}
