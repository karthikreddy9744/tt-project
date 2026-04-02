package com.studygroup.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.studygroup.dto.GroupDTOs;
import com.studygroup.entity.GroupMember;
import com.studygroup.entity.StudyGroup;
import com.studygroup.entity.User;
import com.studygroup.exception.AccessDeniedException;
import com.studygroup.exception.BadRequestException;
import com.studygroup.exception.ResourceNotFoundException;
import com.studygroup.repository.GroupMemberRepository;
import com.studygroup.repository.StudyGroupRepository;
import com.studygroup.repository.UserRepository;

@Service
@Transactional
public class StudyGroupService {

    @Autowired private StudyGroupRepository groupRepository;
    @Autowired private GroupMemberRepository memberRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private UserService userService;

    public GroupDTOs.GroupResponse createGroup(GroupDTOs.CreateGroupRequest request, String email) {
        User user = getUserByEmail(email);

        StudyGroup group = StudyGroup.builder()
                .name(request.getName().trim())
                .subject(request.getSubject().trim())
                .description(request.getDescription())
                .privacy(request.getPrivacy())
                .createdBy(user)
                .build();

        group = groupRepository.save(group);

        GroupMember adminMember = GroupMember.builder()
                .group(group)
                .user(user)
                .role(GroupMember.GroupRole.ADMIN)
                .build();

        memberRepository.save(adminMember);

        return mapToResponse(group, adminMember.getRole().name());
    }

    public Page<GroupDTOs.GroupResponse> getDiscoverGroups(String query, int page, int size, String email) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<StudyGroup> groupsPage;
        
        if (query != null && !query.trim().isEmpty()) {
            groupsPage = groupRepository.searchPublicGroups(query.trim(), pageable);
        } else {
            groupsPage = groupRepository.findByPrivacy(StudyGroup.Privacy.PUBLIC, pageable);
        }

        User user = email != null ? userRepository.findByEmail(email).orElse(null) : null;
        
        return groupsPage.map(group -> {
            String role = null;
            if (user != null) {
                role = memberRepository.findByGroupIdAndUserId(group.getId(), user.getId())
                        .map(m -> m.getRole().name())
                        .orElse(null);
            }
            return mapToResponse(group, role);
        });
    }

    public List<GroupDTOs.GroupResponse> getMyGroups(String email) {
        User user = getUserByEmail(email);
        List<GroupMember> memberships = memberRepository.findByUserId(user.getId());
        
        return memberships.stream()
                .map(m -> mapToResponse(m.getGroup(), m.getRole().name()))
                .collect(Collectors.toList());
    }

    public GroupDTOs.GroupResponse getGroupDetails(Long groupId, String email) {
        StudyGroup group = getGroupById(groupId);
        User user = getUserByEmail(email);
        
        GroupMember member = memberRepository.findByGroupIdAndUserId(groupId, user.getId())
                .orElse(null);
                
        if (group.getPrivacy() == StudyGroup.Privacy.PRIVATE && member == null) {
            throw new AccessDeniedException("This is a private group. You must be a member to view it.");
        }
        
        return mapToResponse(group, member != null ? member.getRole().name() : null);
    }

    public GroupDTOs.GroupResponse updateGroup(Long groupId, GroupDTOs.UpdateGroupRequest request, String email) {
        StudyGroup group = getGroupById(groupId);
        verifyGroupAdmin(groupId, email);

        if (request.getName() != null) group.setName(request.getName().trim());
        if (request.getSubject() != null) group.setSubject(request.getSubject().trim());
        if (request.getDescription() != null) group.setDescription(request.getDescription());
        if (request.getPrivacy() != null) group.setPrivacy(request.getPrivacy());

        group = groupRepository.save(group);
        return mapToResponse(group, GroupMember.GroupRole.ADMIN.name());
    }

    public void deleteGroup(Long groupId, String email) {
        StudyGroup group = getGroupById(groupId);
        verifyGroupAdmin(groupId, email);
        groupRepository.delete(group);
    }

    public String joinGroup(Long groupId, String email) {
        StudyGroup group = getGroupById(groupId);
        User user = getUserByEmail(email);

        if (group.getPrivacy() == StudyGroup.Privacy.PRIVATE) {
            throw new AccessDeniedException("Cannot join a private group directly. You need an invite.");
        }

        if (memberRepository.existsByGroupIdAndUserId(groupId, user.getId())) {
            throw new BadRequestException("You are already a member of this group");
        }

        GroupMember member = GroupMember.builder()
                .group(group)
                .user(user)
                .role(GroupMember.GroupRole.MEMBER)
                .build();

        memberRepository.save(member);
        return "Successfully joined the group";
    }

    public String inviteUser(Long groupId, GroupDTOs.InviteRequest request, String email) {
        StudyGroup group = getGroupById(groupId);
        verifyGroupModifier(groupId, email); // Admin or Mod

        User invitee = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        if (memberRepository.existsByGroupIdAndUserId(groupId, invitee.getId())) {
            throw new BadRequestException("User is already a member of this group");
        }

        GroupMember member = GroupMember.builder()
                .group(group)
                .user(invitee)
                .role(GroupMember.GroupRole.MEMBER)
                .build();

        memberRepository.save(member);
        return "User has been added to the group";
    }

    public List<GroupDTOs.MemberResponse> getMembers(Long groupId, String email) {
        StudyGroup group = getGroupById(groupId);
        User user = getUserByEmail(email);
        
        if (group.getPrivacy() == StudyGroup.Privacy.PRIVATE) {
             memberRepository.findByGroupIdAndUserId(groupId, user.getId())
                .orElseThrow(() -> new AccessDeniedException("You are not a member of this group"));
        }

        return memberRepository.findByGroupId(groupId).stream()
                .map(this::mapToMemberResponse)
                .collect(Collectors.toList());
    }

    public String changeMemberRole(Long groupId, Long targetUserId, GroupDTOs.ChangeRoleRequest request, String email) {
        verifyGroupAdmin(groupId, email);
        
        GroupMember targetMember = memberRepository.findByGroupIdAndUserId(groupId, targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found in group"));
                
        User currentUser = getUserByEmail(email);
        if (currentUser.getId().equals(targetUserId)) {
            throw new BadRequestException("You cannot change your own role");
        }

        try {
            targetMember.setRole(GroupMember.GroupRole.valueOf(request.getRole().toUpperCase()));
            memberRepository.save(targetMember);
            return "Role updated successfully";
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role");
        }
    }

    public void removeMember(Long groupId, Long targetUserId, String email) {
        verifyGroupAdmin(groupId, email);
        
        GroupMember targetMember = memberRepository.findByGroupIdAndUserId(groupId, targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found in group"));
                
        User currentUser = getUserByEmail(email);
        if (currentUser.getId().equals(targetUserId)) {
            throw new BadRequestException("You cannot remove yourself. Leave the group instead.");
        }

        memberRepository.delete(targetMember);
    }

    // Helper methods
    
    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    private StudyGroup getGroupById(Long groupId) {
        return groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Study group not found: " + groupId));
    }

    private GroupMember verifyGroupAdmin(Long groupId, String email) {
        User user = getUserByEmail(email);
        GroupMember member = memberRepository.findByGroupIdAndUserId(groupId, user.getId())
                .orElseThrow(() -> new AccessDeniedException("You are not a member of this group"));
                
        if (member.getRole() != GroupMember.GroupRole.ADMIN) {
            throw new AccessDeniedException("Only group administrators can perform this action");
        }
        return member;
    }
    
    public GroupMember verifyGroupModifier(Long groupId, String email) { // Public so other services can use
        User user = getUserByEmail(email);
        GroupMember member = memberRepository.findByGroupIdAndUserId(groupId, user.getId())
                .orElseThrow(() -> new AccessDeniedException("You are not a member of this group"));
                
        if (member.getRole() == GroupMember.GroupRole.MEMBER) {
            throw new AccessDeniedException("You don't have permission. Moderators or Administrators only.");
        }
        return member;
    }
    
    public GroupMember verifyGroupMembership(Long groupId, String email) { // Public so other services can use
        User user = getUserByEmail(email);
        return memberRepository.findByGroupIdAndUserId(groupId, user.getId())
                .orElseThrow(() -> new AccessDeniedException("You must be a member of this group to perform this action"));
    }

    private GroupDTOs.GroupResponse mapToResponse(StudyGroup group, String role) {
        GroupDTOs.GroupResponse response = new GroupDTOs.GroupResponse();
        response.setId(group.getId());
        response.setName(group.getName());
        response.setSubject(group.getSubject());
        response.setDescription(group.getDescription());
        response.setPrivacy(group.getPrivacy().name());
        response.setCreatedBy(userService.mapToSummary(group.getCreatedBy()));
        response.setCreatedAt(group.getCreatedAt());
        response.setMemberCount(memberRepository.countByGroupId(group.getId()));
        response.setCurrentUserRole(role);
        return response;
    }

    private GroupDTOs.MemberResponse mapToMemberResponse(GroupMember member) {
        GroupDTOs.MemberResponse response = new GroupDTOs.MemberResponse();
        response.setId(member.getId());
        response.setUser(userService.mapToSummary(member.getUser()));
        response.setRole(member.getRole().name());
        response.setJoinedAt(member.getJoinedAt());
        return response;
    }
}
