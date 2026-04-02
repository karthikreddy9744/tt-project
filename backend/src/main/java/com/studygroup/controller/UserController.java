package com.studygroup.controller;

import com.studygroup.dto.UserDTOs;
import com.studygroup.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDTOs.UserProfileResponse> getCurrentProfile(Authentication authentication) {
        return ResponseEntity.ok(userService.getProfile(authentication.getName()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDTOs.UserProfileResponse> updateProfile(
            Authentication authentication,
            @RequestBody UserDTOs.UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(authentication.getName(), request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTOs.UserSummary> getUserSummary(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserSummary(id));
    }
}
