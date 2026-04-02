package com.studygroup.repository;

import com.studygroup.entity.FileEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FileRepository extends JpaRepository<FileEntity, Long> {

    Page<FileEntity> findByGroupId(Long groupId, Pageable pageable);

    @Query("SELECT f FROM FileEntity f WHERE f.group.id = :groupId AND " +
           "(LOWER(f.fileName) LIKE LOWER(CONCAT('%',:query,'%')) OR " +
           "LOWER(f.topic) LIKE LOWER(CONCAT('%',:query,'%')))")
    Page<FileEntity> searchInGroup(@Param("groupId") Long groupId, @Param("query") String query, Pageable pageable);

    Page<FileEntity> findByGroupIdAndTopic(Long groupId, String topic, Pageable pageable);
}
