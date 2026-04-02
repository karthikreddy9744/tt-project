package com.studygroup.dto;

import lombok.Data;
import java.time.LocalDateTime;

public class UserDTOs {

    @Data
    public static class UserSummary {
        private Long id;
        private String name;
        private String email;
        private String institution;
    }

    @Data
    public static class UserProfileResponse {
        private Long id;
        private String name;
        private String email;
        private String institution;
        private String role;
        private LocalDateTime createdAt;
    }

    @Data
    public static class UpdateProfileRequest {
        private String name;
        private String institution;
    }
}
