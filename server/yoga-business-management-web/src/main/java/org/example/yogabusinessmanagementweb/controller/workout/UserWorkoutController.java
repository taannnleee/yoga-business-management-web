package org.example.yogabusinessmanagementweb.controller.workout;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.example.yogabusinessmanagementweb.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class UserWorkoutController {

    private final UserService userService;

//    @GetMapping
//    public ResponseDto<UserResponse> getUserInfo(Authentication authentication) {
//        UserResponse a = new UserResponse();
//        ResponseDto b = new ResponseDto();
//        return b;
//    }
}
