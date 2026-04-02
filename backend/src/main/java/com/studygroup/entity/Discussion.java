package com.studygroup.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "discussions", indexes = {
    @Index(name = "idx_discussions_group_id", columnList = "group_id"),
    @Index(name = "idx_discussions_author_id", columnList = "author_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Discussion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 300)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private StudyGroup group;

    @Column(name = "is_anonymous", nullable = false)
    @Builder.Default
    private Boolean isAnonymous = false;

    @Column(name = "is_solved", nullable = false)
    @Builder.Default
    private Boolean isSolved = false;

    @Column(nullable = false)
    @Builder.Default
    private Integer upvotes = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
