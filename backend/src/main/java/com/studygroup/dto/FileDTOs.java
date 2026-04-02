package com.studygroup.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDateTime;

public class FileDTOs {

    @Data
    public static class FileUploadRequest {
        @Size(max = 200)
        private String topic;
    }

    @Data
    public static class FileResponse {
        private Long id;
        private String fileName;
        private String fileType;
        private Long fileSize;
        private String topic;
        private UserDTOs.UserSummary uploadedBy;
        private Integer upvotes;
        private Integer downvotes;
        private LocalDateTime uploadedAt;
    }

    @Data
    public static class VoteRequest {
        @NotBlank
        private String voteType; // "UPVOTE" or "DOWNVOTE"
    }
}
