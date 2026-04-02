package com.studygroup.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.studygroup.dto.AuthDTOs;
import com.studygroup.entity.User;
import com.studygroup.exception.BadRequestException;
import com.studygroup.exception.ResourceNotFoundException;
import com.studygroup.repository.UserRepository;
import com.studygroup.security.JwtUtils;

@Service
@Transactional
public class AuthService {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtils jwtUtils;
    @Autowired private AuthenticationManager authenticationManager;
    
    public String register(AuthDTOs.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase())) {
            throw new BadRequestException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName().trim())
                .email(request.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .institution(request.getInstitution())
                .build();

        userRepository.save(user);

        return "Registration successful. You can now log in.";
    }

    public AuthDTOs.AuthResponse login(AuthDTOs.LoginRequest request) {
        try {
             authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail().toLowerCase().trim(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new BadRequestException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String token = jwtUtils.generateToken(user.getEmail());
        return new AuthDTOs.AuthResponse(token, user.getId(), user.getName(),
                user.getEmail(), user.getInstitution());
    }
}

