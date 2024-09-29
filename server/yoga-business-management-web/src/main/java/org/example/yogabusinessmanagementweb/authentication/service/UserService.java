package org.example.yogabusinessmanagementweb.authentication.service;


import jakarta.servlet.http.HttpServletRequest;
import org.example.yogabusinessmanagementweb.authentication.dto.request.LoginRequest;
import org.example.yogabusinessmanagementweb.authentication.dto.request.RegistrationRequest;
import org.example.yogabusinessmanagementweb.authentication.dto.request.UpdateProfileRequest;
import org.example.yogabusinessmanagementweb.authentication.dto.response.ProfileResponse;
import org.example.yogabusinessmanagementweb.authentication.dto.response.RegistrationResponse;
import org.example.yogabusinessmanagementweb.common.entities.User;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User findUserById(String id);
    List<User> getAllUser();
    User findByUserName(String username);
    boolean checkUserNotExist(RegistrationRequest registrationRequest);
    RegistrationResponse registerUser(RegistrationRequest registrationRequest);
    User findByPhone(String phoneNumber);
    UserDetailsService userDetailsService();
    User findByEmail(String email);
    long saveUser(User user);

    ProfileResponse getProfile(HttpServletRequest request);

    void updateProfile(UpdateProfileRequest updateProfileRequest, HttpServletRequest request);
}
