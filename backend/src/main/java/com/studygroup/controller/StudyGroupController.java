package com.studygroup.controller;

import com.studygroup.dto.GroupDTOs;
import com.studygroup.service.StudyGroupService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/groups")
public class StudyGroupController {

    @Autowired
    private StudyGroupService groupService;

    @PostMapping
    public ResponseEntity<GroupDTOs.GroupResponse> createGroup(
            @Valid @RequestBody GroupDTOs.CreateGroupRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(groupService.createGroup(request, authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<Page<GroupDTOs.GroupResponse>> getDiscoverGroups(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(groupService.getDiscoverGroups(query, page, size, email));
    }

    @GetMapping("/my")
    public ResponseEntity<List<GroupDTOs.GroupResponse>> getMyGroups(Authentication authentication) {
        return ResponseEntity.ok(groupService.getMyGroups(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupDTOs.GroupResponse> getGroupDetails(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(groupService.getGroupDetails(id, authentication.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GroupDTOs.GroupResponse> updateGroup(
            @PathVariable Long id,
            @RequestBody GroupDTOs.UpdateGroupRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(groupService.updateGroup(id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGroup(
            @PathVariable Long id,
            Authentication authentication) {
        groupService.deleteGroup(id, authentication.getName());
        return ResponseEntity.ok(Map.of("message", "Group deleted successfully"));
    }

    // Membership

    @PostMapping("/{id}/join")
    public ResponseEntity<?> joinGroup(
            @PathVariable Long id,
            Authentication authentication) {
        String message = groupService.joinGroup(id, authentication.getName());
        return ResponseEntity.ok(Map.of("message", message));
    }

    @PostMapping("/{id}/invite")
    public ResponseEntity<?> inviteUser(
            @PathVariable Long id,
            @Valid @RequestBody GroupDTOs.InviteRequest request,
            Authentication authentication) {
        String message = groupService.inviteUser(id, request, authentication.getName());
        return ResponseEntity.ok(Map.of("message", message));
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<List<GroupDTOs.MemberResponse>> getMembers(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(groupService.getMembers(id, authentication.getName()));
    }

    @PutMapping("/{id}/members/{userId}/role")
    public ResponseEntity<?> changeMemberRole(
            @PathVariable Long id,
            @PathVariable Long userId,
            @Valid @RequestBody GroupDTOs.ChangeRoleRequest request,
            Authentication authentication) {
        String message = groupService.changeMemberRole(id, userId, request, authentication.getName());
        return ResponseEntity.ok(Map.of("message", message));
    }

    @DeleteMapping("/{id}/members/{userId}")
    public ResponseEntity<?> removeMember(
            @PathVariable Long id,
            @PathVariable Long userId,
            Authentication authentication) {
        groupService.removeMember(id, userId, authentication.getName());
        return ResponseEntity.ok(Map.of("message", "Member removed successfully"));
    }
}
