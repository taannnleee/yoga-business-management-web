package org.example.yogabusinessmanagementweb.workoutwithAI.service;

import jakarta.mail.MessagingException;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.user.ChangePasswordDto;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.user.UserRequest;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.user.UserResponse;

import java.util.Map;

public interface UserService {

    UserResponse update(UserRequest userRequest);

    UserResponse updatePassword(String email, ChangePasswordDto changePasswordDto);

    UserResponse findByEmail(String email);

    Map<String, String> enableUser(String email) throws MessagingException;
    void createData();
}
