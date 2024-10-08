package org.example.yogabusinessmanagementweb.yoga.service;


import jakarta.servlet.http.HttpServletRequest;
import org.example.yogabusinessmanagementweb.yoga.dto.request.user.RegistrationRequest;
import org.example.yogabusinessmanagementweb.yoga.dto.request.user.UpdateProfileRequest;
import org.example.yogabusinessmanagementweb.yoga.dto.response.user.ProfileResponse;
import org.example.yogabusinessmanagementweb.yoga.dto.response.user.RegistrationResponse;
import org.example.yogabusinessmanagementweb.common.entities.Address;
import org.example.yogabusinessmanagementweb.common.entities.User;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService {
    User findUserById(String id);
    List<User> getAllUser();
    User findByUserName(String username);
    boolean checkUserNotExist(RegistrationRequest registrationRequest);
    RegistrationResponse registerUser(RegistrationRequest registrationRequest);
    List<Address> getUserAddresses(Long userId);
    User findByPhone(String phoneNumber);
    UserDetailsService userDetailsService();
    User findByEmail(String email);
    long saveUser(User user);

    ProfileResponse getProfile(HttpServletRequest request);

    void updateProfile(UpdateProfileRequest updateProfileRequest, HttpServletRequest request);
}
