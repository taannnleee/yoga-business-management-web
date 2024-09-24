package org.example.yogabusinessmanagementweb.authentication.service;


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
    List<User> getAllUser();
    Optional<User>  findByUserName(String username);
    boolean checkUserNotExist(RegistrationRequest registrationRequest);
    User checkUser(RegistrationRequest registrationRequest);
    RegistrationResponse registerUser(RegistrationRequest registrationRequest);
    Optional<User> findByPhone(String phoneNumber);
    User checkLogin(LoginRequest loginRequest);
    boolean changePassword(String email, String newPassword);
    UserDetailsService userDetailsService();
    Optional<User> findByEmail(String email);
    long saveUser(User user);

    ProfileResponse getProfile(String id);

    void updateProfile(UpdateProfileRequest updateProfileRequest, String id);
}
