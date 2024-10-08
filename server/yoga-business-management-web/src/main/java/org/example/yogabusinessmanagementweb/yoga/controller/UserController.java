package org.example.yogabusinessmanagementweb.yoga.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.yoga.dto.request.user.UpdateProfileRequest;
import org.example.yogabusinessmanagementweb.yoga.dto.response.user.ProfileResponse;
import org.example.yogabusinessmanagementweb.yoga.dto.response.ApiResponse;
import org.example.yogabusinessmanagementweb.yoga.repositories.UserRepository;
import org.example.yogabusinessmanagementweb.yoga.service.Impl.AuthencationService;
import org.example.yogabusinessmanagementweb.yoga.service.UserService;
import org.example.yogabusinessmanagementweb.sendEmail.service.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/user")
@Slf4j
public class UserController {
    UserService userService;
    UserRepository userRepository;
    EmailService emailService;
    AuthencationService authencationService;

    @GetMapping("/getProfile")
    public ApiResponse<?> getProfile(HttpServletRequest request){
        ProfileResponse profileResponse =  userService.getProfile(request);
        return new ApiResponse<>(HttpStatus.OK.value(), "getProfile successfully",profileResponse);
    }
    @PostMapping("/updateProfile")
    public ApiResponse<?> updateProfile(@RequestBody UpdateProfileRequest updateProfileRequest, HttpServletRequest request){
        userService.updateProfile(updateProfileRequest, request);
        return new ApiResponse<>(HttpStatus.OK.value(), "update profile successfully");

    }



}
