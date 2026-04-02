package com.studygroup.dto;

import com.studygroup.entity.StudyGroup;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDateTime;

public class GroupDTOs {

    @Data
    public static class CreateGroupRequest {
        @NotBlank(message = "Group name is required")
        @Size(min = 3, max = 200)
        private String name;

        @NotBlank(message = "Subject is required")
        @Size(min = 2, max = 200)
        private String subject;

        @Size(max = 1000)
        private String description;

        @NotNull(message = "Privacy setting is required")
        private StudyGroup.Privacy privacy;
    }

    @Data
    public static class UpdateGroupRequest {
        @Size(min = 3, max = 200)
        private String name;

        @Size(min = 2, max = 200)
        private String subject;

        @Size(max = 1000)
        private String description;

        private StudyGroup.Privacy privacy;
    }

    @Data
    public static class GroupResponse {
        private Long id;
        private String name;
        private String subject;
        private String description;
        private String privacy;
        private UserDTOs.UserSummary createdBy;
        private LocalDateTime createdAt;
        private Long memberCount;
        private String currentUserRole;
    }

    @Data
    public static class MemberResponse {
        private Long id;
        private UserDTOs.UserSummary user;
        private String role;
        private LocalDateTime joinedAt;
    }

    @Data
    public static class ChangeRoleRequest {
        @NotBlank
        private String role;
    }

    @Data
    public static class InviteRequest {
        @NotBlank
        private String email;
    }
}
