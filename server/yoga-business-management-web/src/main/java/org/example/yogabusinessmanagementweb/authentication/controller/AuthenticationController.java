package org.example.yogabusinessmanagementweb.authentication.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.authentication.dto.request.LoginRequest;
import org.example.yogabusinessmanagementweb.authentication.dto.request.RegistrationRequest;
import org.example.yogabusinessmanagementweb.authentication.dto.request.ResetPasswordDTO;
import org.example.yogabusinessmanagementweb.authentication.dto.response.ResponseData;
import org.example.yogabusinessmanagementweb.authentication.dto.response.TokenRespone;
import org.example.yogabusinessmanagementweb.authentication.exception.*;
import org.example.yogabusinessmanagementweb.authentication.repositories.UserRepository;
import org.example.yogabusinessmanagementweb.authentication.service.Impl.AuthencationService;
import org.example.yogabusinessmanagementweb.authentication.service.UserService;
import org.example.yogabusinessmanagementweb.sendEmail.service.EmailService;
import org.springframework.dao.InvalidDataAccessApiUsageException;
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

//    @GetMapping("/getAllUser")
//    public ResponseData getAllUser() {
//        log.info("getAllUser");
//        return new ResponseData<>(HttpStatus.CREATED.value(), "Success",userService.getAllUser());
//    }

    @GetMapping("/getAllUser")
    public ResponseData<?> getAllUser() {
        return new ResponseData<>(HttpStatus.OK.value(), "Get all user success", userService.getAllUser());
    }

    @PostMapping("/register")
    public ResponseData<?> registerUser(@RequestBody RegistrationRequest registrationRequest) {
        try {
            userService.checkUser(registrationRequest);
            return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "Phone number,username or email already exists");
        }
        catch (InvalidPasswordException e) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "Passwords do not match");
        }
        catch (UserNotFoundException e) {
            RegistrationRequest rp = userService.registerUser(registrationRequest);
            return new ResponseData<>(HttpStatus.OK.value(), "User registered successfully",rp);
        }
    }

    @PostMapping("verifyOTP_register")
    public ResponseData<TokenRespone> verifyOTPRegister(String OTP,  String email) {
        try {
            authencationService.verifyOTP_register(OTP, email);
            return new ResponseData<>(HttpStatus.OK.value(), "OTP is valid. Proceed with register.");
        } catch (UserNotFoundException | TokenNotFoundException | InvalidOtpException e) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }

    @PostMapping("/refresh")
    public ResponseData<TokenRespone> refreshToken(HttpServletRequest request) {
        return new ResponseData<>(HttpStatus.OK.value(), "Login Success", authencationService.refresh(request));
    }
    @PostMapping("/login")
    public ResponseData<TokenRespone> login(@RequestBody LoginRequest loginRequest) {
        try {
            TokenRespone tokenRespone = authencationService.authentication(loginRequest);
            return new ResponseData<>( HttpStatus.OK.value(),"Login Success",tokenRespone);
        }catch (BadCredentialsException e){
            return new ResponseData<>(HttpStatus.BAD_REQUEST.value(),"Bad credentials");
        }
        catch (AccoutIsNotActive e){
            return new ResponseData<>(HttpStatus.BAD_REQUEST.value(),"Accout Is Not Active");
        }
    }

    @PostMapping("/logout")
    public ResponseData<?> logout(HttpServletRequest request) {
        return new ResponseData<>(HttpStatus.OK.value(), "Logout Success", authencationService.logout(request));
    }

    @PostMapping("/forgot-password")
    public ResponseData<?> forgotPassword(@RequestBody String email) {
        try {
            String result = authencationService.forgotPassword(email);
            // Trả về phản hồi thành công
            return new ResponseData<>(HttpStatus.OK.value(), "Success"+result);
        } catch (UserNotFoundException e) {
            // Nếu không tìm thấy người dùng
            return new ResponseData<>(HttpStatus.NOT_FOUND.value(), "NOT_FOUND");
        } catch (InvalidDataAccessApiUsageException e) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "BAD_REQUEST");
        } catch (Exception e) {
            // Xử lý các lỗi khác
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "INTERNAL_SERVER_ERROR");
        }
    }

    @PostMapping("/reset-password")
    public ResponseData<?> resetPassword(@RequestBody String OTP,String email) {
        try {
            authencationService.resetPassword(OTP, email);
            return new ResponseData<>(HttpStatus.OK.value(), "OTP is valid. Proceed with password reset.");
        } catch (UserNotFoundException | TokenNotFoundException | InvalidOtpException e) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }

    @PostMapping("/change-password")
    public ResponseData<?> changePassword(@RequestBody ResetPasswordDTO request) {
        return new ResponseData<>(HttpStatus.OK.value(), "Success", authencationService.changePassword(request));
    }



}