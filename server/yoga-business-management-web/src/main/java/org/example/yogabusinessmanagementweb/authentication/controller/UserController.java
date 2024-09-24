package org.example.yogabusinessmanagementweb.authentication.controller;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.authentication.dto.request.UpdateProfileRequest;
import org.example.yogabusinessmanagementweb.authentication.dto.response.ProfileResponse;
import org.example.yogabusinessmanagementweb.authentication.dto.response.ResponseData;
import org.example.yogabusinessmanagementweb.authentication.exception.UserNotFoundException;
import org.example.yogabusinessmanagementweb.authentication.repositories.UserRepository;
import org.example.yogabusinessmanagementweb.authentication.service.Impl.AuthencationService;
import org.example.yogabusinessmanagementweb.authentication.service.UserService;
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

    @GetMapping("/getAllUser")
    public ResponseData<?> getAllUser() {
        return new ResponseData<>(HttpStatus.OK.value(), "Get all user success", userService.getAllUser());
    }

    @GetMapping("/getProfile/{id}")
    public ResponseData<?> getProfile(@PathVariable String id){
        try{
            ProfileResponse profileResponse =  userService.getProfile(id);
            return new ResponseData<>(HttpStatus.OK.value(), "getProfile successfully",profileResponse);

        }catch (UserNotFoundException e){
            return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), e.getMessage(), null);
        }
    }
    @PostMapping("/updateProfile/{id}")
    public ResponseData<?> updateProfile(@RequestBody UpdateProfileRequest updateProfileRequest, @PathVariable String id){
        try{
            userService.updateProfile(updateProfileRequest, id);
            return new ResponseData<>(HttpStatus.OK.value(), "update profile successfully");

        }catch (UserNotFoundException e){
            return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }
}
