package com.studygroup.repository;

import com.studygroup.entity.Discussion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DiscussionRepository extends JpaRepository<Discussion, Long> {

    Page<Discussion> findByGroupId(Long groupId, Pageable pageable);

    Page<Discussion> findByGroupIdAndIsSolved(Long groupId, Boolean isSolved, Pageable pageable);

    @Query("SELECT d FROM Discussion d WHERE d.group.id = :groupId AND " +
           "(LOWER(d.title) LIKE LOWER(CONCAT('%',:query,'%')) OR " +
           "LOWER(d.content) LIKE LOWER(CONCAT('%',:query,'%')))")
    Page<Discussion> searchInGroup(@Param("groupId") Long groupId, @Param("query") String query, Pageable pageable);

    long countByGroupIdAndIsSolved(Long groupId, Boolean isSolved);
}
