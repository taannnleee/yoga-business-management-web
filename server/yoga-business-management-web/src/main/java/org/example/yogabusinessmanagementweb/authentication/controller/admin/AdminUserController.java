package org.example.yogabusinessmanagementweb.authentication.controller.admin;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.authentication.dto.response.ResponseData;
import org.example.yogabusinessmanagementweb.authentication.repositories.UserRepository;
import org.example.yogabusinessmanagementweb.authentication.service.Impl.AuthencationService;
import org.example.yogabusinessmanagementweb.authentication.service.UserService;
import org.example.yogabusinessmanagementweb.sendEmail.service.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/admin")
@Slf4j
public class AdminUserController {

    UserService userService;
    UserRepository userRepository;
    EmailService emailService;
    AuthencationService authencationService;

    @GetMapping("/getAllUser")
    public ResponseData<?> getAllUser() {
        log.info("Request to get all users received");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null) {
            log.info("Authenticated user: {}", authentication.getName());
            log.info("User scopes: ");
            authentication.getAuthorities().forEach(grantedAuthority -> {
                log.info(" - {}", grantedAuthority.getAuthority());
            });
        } else {
            log.warn("No authenticated user found");
        }

        return new ResponseData<>(HttpStatus.OK.value(), "Get all user success", userService.getAllUser());
    }

    @GetMapping("getUserById/{id}")
    public ResponseData<?> getUserById(@PathVariable Integer id) {
        return new ResponseData<>(HttpStatus.OK.value(), "Get all user success", userService.findUserById(String.valueOf(id)));
    }
}
