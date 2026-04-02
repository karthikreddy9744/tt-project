package com.studygroup.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "files", indexes = {
    @Index(name = "idx_files_group_id", columnList = "group_id"),
    @Index(name = "idx_files_uploaded_by", columnList = "uploaded_by")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_name", nullable = false, length = 255)
    private String fileName;

    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath;

    @Column(name = "file_type", length = 100)
    private String fileType;

    @Column(name = "file_size")
    private Long fileSize;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private StudyGroup group;

    @Column(nullable = false)
    @Builder.Default
    private Integer upvotes = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer downvotes = 0;

    @Column(length = 200)
    private String topic;

    @CreationTimestamp
    @Column(name = "uploaded_at", nullable = false, updatable = false)
    private LocalDateTime uploadedAt;
}
