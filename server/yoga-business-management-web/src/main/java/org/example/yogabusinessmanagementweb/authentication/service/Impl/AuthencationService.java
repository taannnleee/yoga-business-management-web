package org.example.yogabusinessmanagementweb.authentication.service.Impl;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.apache.commons.lang3.StringUtils;
import org.example.yogabusinessmanagementweb.authentication.dto.request.LoginRequest;
import org.example.yogabusinessmanagementweb.authentication.dto.request.ResetPasswordDTO;
import org.example.yogabusinessmanagementweb.authentication.dto.response.TokenRespone;
import org.example.yogabusinessmanagementweb.authentication.exception.*;
import org.example.yogabusinessmanagementweb.authentication.repositories.UserRepository;
import org.example.yogabusinessmanagementweb.authentication.service.JwtService;
import org.example.yogabusinessmanagementweb.authentication.service.TokenService;
import org.example.yogabusinessmanagementweb.authentication.service.UserService;
import org.example.yogabusinessmanagementweb.common.Enum.EMessage;
import org.example.yogabusinessmanagementweb.common.entities.Token;
import org.example.yogabusinessmanagementweb.common.entities.User;
import org.example.yogabusinessmanagementweb.sendEmail.service.EmailService;
import org.example.yogabusinessmanagementweb.sendEmail.utils.OTPGenerator;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

import static org.example.yogabusinessmanagementweb.common.Enum.ETokenType.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class AuthencationService {
    AuthenticationManager authenticationManager;
    UserRepository userRepository;
    JwtService jwtService;
    TokenService tokenService;
    UserService userService;
    PasswordEncoder passwordEncoder;
    EmailService emailService;

    public TokenRespone authentication(LoginRequest loginRequest){
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        }
        catch (BadCredentialsException e) {
            throw new RuntimeException("Username or Password is incorrect", e);
        }

        User user = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow(() -> new UsernameNotFoundException("Username or Password is incorrect"));

        if(user.isStatus()==false){
            throw new AccoutIsNotActive("Account is not active");
        }


        String accessToken =  jwtService.generateToken(user);
        String refresh_token =  jwtService.generateRefreshToken(user);

        //save token vào db
        tokenService.save(Token.builder()
                        .username(user.getUsername())
                        .accessToken(accessToken)
                        .refreshToken(refresh_token)
                        .build());

        return TokenRespone.builder()
                .accesstoken(accessToken)
                .refreshtoken(refresh_token)
                .userid(user.getId())
                .build();
    }

    public TokenRespone refresh(HttpServletRequest loginRequest) {
        //validate xem token cos rỗng không
        String refresh_token = loginRequest.getHeader("x-token");
        if(StringUtils.isBlank(refresh_token)){
            throw new AppException(ErrorCode.TOKEN_EMPTY);
        }
        //extract user from token
        final String userName = jwtService.extractUsername(refresh_token, REFRESHTOKEN);

        //check it into db
        User user =  userService.findByUserName(userName);


        //validate xem token có hợp lệ không
        if(!jwtService.isValid(refresh_token, REFRESHTOKEN,user)){
            throw new AppException(ErrorCode.TOKEN_INVALID);
        }

        String accessToken =  jwtService.generateToken(user);

        return TokenRespone.builder()
                .accesstoken(accessToken)
                .refreshtoken(refresh_token)
                .userid(user.getId())
                .build();
    }

    public String logout(HttpServletRequest request) {
        //validate xem token cos rỗng không
        String refresh_token = request.getHeader("x-token");
        if(StringUtils.isBlank(refresh_token)){
            throw new AppException(ErrorCode.TOKEN_EMPTY);
        }

        //extract user from token
        final String userName = jwtService.extractUsername(refresh_token, REFRESHTOKEN);

        //check token in db
        Token tokenCurrent = tokenService.getTokenByUsername(userName);

        //delete token
        tokenService.delete(tokenCurrent);
        return "delete!";
    }

    public String sendOTP(String email) {
        // Check if email exists
        User user = userService.findByEmail(email);
        // Check if user is active
        if (!user.isEnabled()) {
            throw new AppException(ErrorCode.USER_NOT_ACTIVE);
        }

        // Generate OTP and send email
        String OTP = OTPGenerator.generateOTP();
        emailService.sendEmail(email, EMessage.TITLE_OTP.getValue(), EMessage.TEXT_EMAIL_OTP.getValue() + OTP);

        // Save OTP into database
        Token token = tokenService.getTokenByUsername(user.getUsername());
        if (token == null) {
            token = new Token();
            token.setUsername(user.getUsername());
        }
        token.setOTP(OTP);
        tokenService.save(token);

        // Return success response
        System.out.println("OTP sent to email: " + email);
        return "OTP sent successfully";

    }

    public void resetPassword(String OTP, String email) {
        User user = userService.findByEmail(email);
        Token token = tokenService.getTokenByUsername(user.getUsername());
        if (token == null) {
            throw new AppException(ErrorCode.TOKEN_NOT_FOUND);
        }

        if (!OTP.equals(token.getOTP())) {
            throw new AppException(ErrorCode.OTP_INVALID);
        }
    }

    public String changePassword(ResetPasswordDTO request) {

        User user = userService.findByEmail(request.getEmail());

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new AppException(ErrorCode.PASS_WORD_NOT_MATCHED);
        }

        String encryptedPassword = passwordEncoder.encode(request.getPassword());
        user.setPassword(encryptedPassword);
        userService.saveUser(user);

        return "Password successfully changed";
    }

    public void verifyOTP_register(String OTP, String email) {

        User user = userService.findByEmail(email);

        Token token = tokenService.getTokenByUsername(user.getUsername());
        if (token == null) {
            throw new AppException(ErrorCode.TOKEN_NOT_FOUND);
        }

        if (!OTP.equals(token.getOTP())) {
            throw new AppException(ErrorCode.OTP_INVALID);
        }

        user.setStatus(true);
        userService.saveUser(user);

    }


//    public String resetPassword(String secretKey) {
//        final String userName = jwtService.extractUsername(secretKey, RESETTOKEN);
//        User user = userService.findByUserName(userName).orElse(null);
//        if(!jwtService.isValid(secretKey, RESETTOKEN, user)){
//            throw new InvalidDataAccessApiUsageException("Token is invalid");
//        }
//        return "reset";
//    }

//    public String changePassword(ResetPasswordDTO request) {
//        User user = isValidUserByToken(request.getSecretKey());
//        if(!request.getPassword().equals(request.getConfirmPassword())){
//            throw new InvalidDataAccessApiUsageException("Password not match");
//        }
//        user.setPassword(passwordEncoder.encode(request.getPassword()));
//        userService.saveUser(user);
//        return "Changed";
//    }
//    private User isValidUserByToken(String secretKey) {
//        final String userName = jwtService.extractUsername(secretKey, RESETTOKEN);
//        User user = userService.findByUserName(userName).orElse(null);
//
//        if(!user.isEnabled()){
//            throw new InvalidDataAccessApiUsageException("User is active");
//        }
//
//        if(!jwtService.isValid(secretKey, RESETTOKEN, user)){
//            throw new InvalidDataAccessApiUsageException("Token is invalid");
//        }
//        return user;
//    }
}