package com.studygroup.repository;

import com.studygroup.entity.GroupMember;
import com.studygroup.entity.GroupMember.GroupRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {

    Optional<GroupMember> findByGroupIdAndUserId(Long groupId, Long userId);

    boolean existsByGroupIdAndUserId(Long groupId, Long userId);

    List<GroupMember> findByGroupId(Long groupId);

    List<GroupMember> findByUserId(Long userId);

    long countByGroupId(Long groupId);

    @Query("SELECT gm FROM GroupMember gm WHERE gm.group.id = :groupId AND gm.role = :role")
    List<GroupMember> findByGroupIdAndRole(@Param("groupId") Long groupId, @Param("role") GroupRole role);
}
