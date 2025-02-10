package org.example.yogabusinessmanagementweb.workoutwithAI.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.ResponseDto;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.user.ChangePasswordDto;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.user.UserRequest;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.user.UserResponse;
import org.example.yogabusinessmanagementweb.workoutwithAI.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class UserWorkoutController {

    private final UserService userService;

    @GetMapping
    public ResponseDto<UserResponse> getUserInfo(Authentication authentication) {
        return ResponseDto.success(
                userService.findByEmail(authentication.getName())
        );
    }

    @PostMapping("/update")
    public ResponseDto<UserResponse> updateUserInfo(@Valid @RequestBody UserRequest userRequest,
                                                    Authentication authentication) {
        userRequest.setEmail(authentication.getName());
        return ResponseDto.success(
                userService.update(userRequest)
        );
    }

    @PostMapping("/update-password")
    public ResponseDto<UserResponse> updatePassword(@Valid @RequestBody ChangePasswordDto changePasswordDto,
                                                    Authentication authentication) {
        return ResponseDto.success(
                userService.updatePassword(authentication.getName(), changePasswordDto)
        );
    }

    @PostMapping("/enable")
    public ResponseDto<Object> enableUser(Authentication authentication) throws MessagingException {
        return ResponseDto.success(
                userService.enableUser(authentication.getName())
        );
    }
}
