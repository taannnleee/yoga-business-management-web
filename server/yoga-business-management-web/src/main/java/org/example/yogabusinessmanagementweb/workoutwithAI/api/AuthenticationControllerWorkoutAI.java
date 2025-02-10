package org.example.yogabusinessmanagementweb.workoutwithAI.api;

import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.ResponseDto;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.auth.AuthenticationRequest;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.auth.AuthenticationResponse;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.auth.RegisterRequest;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.auth.VerifyRequest;
import org.example.yogabusinessmanagementweb.workoutwithAI.service.authen.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin("*")
public class AuthenticationControllerWorkoutAI {

    @Autowired
    private AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<ResponseDto<Object>> register(
            @Valid
            @RequestBody RegisterRequest request
    ) throws MessagingException {
        return ResponseEntity.ok(
                service.register(request)
        );
    }

    @PostMapping("/verify")
    public ResponseEntity<ResponseDto<Object>> verify(
            @Valid
            @RequestBody VerifyRequest request
    ) {
        return ResponseEntity.ok(
                service.verify(request)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseDto<AuthenticationResponse>> authenticate(
            @Valid
            @RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(
                ResponseDto.success(service.authenticate(request))
        );
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ResponseDto<AuthenticationResponse>> refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        return ResponseEntity.ok(
                ResponseDto.success(service.refreshToken(request, response))
        );
    }
}
