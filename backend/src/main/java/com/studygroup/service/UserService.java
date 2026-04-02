package com.studygroup.service;

import com.studygroup.dto.UserDTOs;
import com.studygroup.entity.User;
import com.studygroup.exception.ResourceNotFoundException;
import com.studygroup.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserDTOs.UserProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return mapToProfileResponse(user);
    }

    public UserDTOs.UserProfileResponse updateProfile(String email, UserDTOs.UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            user.setName(request.getName().trim());
        }
        if (request.getInstitution() != null) {
            user.setInstitution(request.getInstitution().trim());
        }

        user = userRepository.save(user);
        return mapToProfileResponse(user);
    }

    public UserDTOs.UserSummary getUserSummary(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return mapToSummary(user);
    }

    private UserDTOs.UserProfileResponse mapToProfileResponse(User user) {
        UserDTOs.UserProfileResponse response = new UserDTOs.UserProfileResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setInstitution(user.getInstitution());
        response.setRole(user.getRole().name());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }

    public UserDTOs.UserSummary mapToSummary(User user) {
        UserDTOs.UserSummary summary = new UserDTOs.UserSummary();
        summary.setId(user.getId());
        summary.setName(user.getName());
        summary.setEmail(user.getEmail());
        summary.setInstitution(user.getInstitution());
        return summary;
    }
}
