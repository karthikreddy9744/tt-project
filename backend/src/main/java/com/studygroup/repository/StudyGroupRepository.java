package com.studygroup.repository;

import com.studygroup.entity.StudyGroup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyGroupRepository extends JpaRepository<StudyGroup, Long> {

    Page<StudyGroup> findByPrivacy(StudyGroup.Privacy privacy, Pageable pageable);

    @Query("SELECT g FROM StudyGroup g WHERE g.privacy = 'PUBLIC' AND " +
           "(LOWER(g.name) LIKE LOWER(CONCAT('%',:query,'%')) OR " +
           "LOWER(g.subject) LIKE LOWER(CONCAT('%',:query,'%')))")
    Page<StudyGroup> searchPublicGroups(@Param("query") String query, Pageable pageable);

    @Query("SELECT gm.group FROM GroupMember gm WHERE gm.user.id = :userId")
    List<StudyGroup> findGroupsByUserId(@Param("userId") Long userId);
}
