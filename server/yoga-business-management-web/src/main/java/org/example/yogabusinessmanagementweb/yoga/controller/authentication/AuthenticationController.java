package org.example.yogabusinessmanagementweb.yoga.controller.authentication;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.yoga.dto.request.user.LoginRequest;
import org.example.yogabusinessmanagementweb.yoga.dto.request.user.RegistrationRequest;
import org.example.yogabusinessmanagementweb.yoga.dto.request.user.ResetPasswordDTO;
import org.example.yogabusinessmanagementweb.yoga.dto.response.user.RegistrationResponse;
import org.example.yogabusinessmanagementweb.yoga.dto.response.ApiResponse;
import org.example.yogabusinessmanagementweb.yoga.dto.response.token.TokenRespone;
import org.example.yogabusinessmanagementweb.yoga.repositories.UserRepository;
import org.example.yogabusinessmanagementweb.yoga.service.Impl.AuthencationService;
import org.example.yogabusinessmanagementweb.yoga.service.UserService;
import org.example.yogabusinessmanagementweb.sendEmail.service.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/auth")
@Slf4j
public class AuthenticationController {
    UserService userService;
    UserRepository userRepository;
    EmailService emailService;
    AuthencationService authencationService;

    @PostMapping("/register")
    public ApiResponse<?> registerUser(@RequestBody RegistrationRequest registrationRequest) {
        userService.checkUserNotExist(registrationRequest);
        RegistrationResponse rp = userService.registerUser(registrationRequest);
        return new ApiResponse<>(HttpStatus.OK.value(), "User registered successfully", rp);
    }

    @PostMapping("verifyOTP_register")
    public ApiResponse<TokenRespone> verifyOTPRegister(@RequestParam String OTP, @RequestParam  String email) {
        authencationService.verifyOTP_register(OTP, email);
        return new ApiResponse<>(HttpStatus.OK.value(), "OTP is valid. Proceed with register.");

    }

    @PostMapping("/refresh")
    public ApiResponse<TokenRespone> refreshToken(HttpServletRequest request) {
        return new ApiResponse<>(HttpStatus.OK.value(), "Refresh token success", authencationService.refresh(request));
    }
    @PostMapping("/login")
    public ApiResponse<TokenRespone> login(@RequestBody LoginRequest loginRequest) {
        try {
            TokenRespone tokenRespone = authencationService.authentication(loginRequest);
            return new ApiResponse<>( HttpStatus.OK.value(),"Login success",tokenRespone);
        }catch (BadCredentialsException e){
            return new ApiResponse<>(HttpStatus.BAD_REQUEST.value(),"Bad credentials");
        }
    }

    @PostMapping("/logout")
    public ApiResponse<?> logout(HttpServletRequest request) {
        return new ApiResponse<>(HttpStatus.OK.value(), "Logout success", authencationService.logout(request));
    }

    @PostMapping("/forgot-password")
    public ApiResponse<?> forgotPassword(@RequestBody String email) {
        String result = authencationService.sendOTP(email);
        return new ApiResponse<>(HttpStatus.OK.value(), "Success"+result);
    }

    @PostMapping("/reset-password")
    public ApiResponse<?> resetPassword(@RequestBody String OTP, String email) {
        authencationService.resetPassword(OTP, email);
        return new ApiResponse<>(HttpStatus.OK.value(), "OTP is valid. Proceed with password reset.");

    }

    @PostMapping("/change-password")
    public ApiResponse<?> changePassword(@RequestBody ResetPasswordDTO request) {
        return new ApiResponse<>(HttpStatus.OK.value(), "Success", authencationService.changePassword(request));
    }
}