package org.example.yogabusinessmanagementweb.workoutwithAI.service.impl;


import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.yogabusinessmanagementweb.workoutwithAI.constant.AppConstants;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.mapper.HealthyInfoMapper;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.mapper.UserMapper;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.user.ChangePasswordDto;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.user.HealthyInfoDto;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.user.UserRequest;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.user.UserResponse;
import org.example.yogabusinessmanagementweb.workoutwithAI.entity.Privilege;
import org.example.yogabusinessmanagementweb.workoutwithAI.entity.Role;
import org.example.yogabusinessmanagementweb.workoutwithAI.entity.UserWorkout;
import org.example.yogabusinessmanagementweb.workoutwithAI.exception.BadRequestException;
import org.example.yogabusinessmanagementweb.workoutwithAI.repository.PrivilegeRepository;
import org.example.yogabusinessmanagementweb.workoutwithAI.repository.RoleRepository;
import org.example.yogabusinessmanagementweb.workoutwithAI.repository.UserWorkoutRepository;
import org.example.yogabusinessmanagementweb.workoutwithAI.repository.VerifyCodeRepository;
import org.example.yogabusinessmanagementweb.workoutwithAI.service.HealthyService;
import org.example.yogabusinessmanagementweb.workoutwithAI.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;



@Service
@RequiredArgsConstructor
public class UserServiceWorkoutImpl implements UserService {
    private final UserWorkoutRepository userRepository;
    private final RoleRepository roleRepository;
    private final PrivilegeRepository privilegeRepository;
    private final HealthyService healthyService;

    private final VerifyCodeRepository verifyCodeRepository;
    private final PasswordEncoder passwordEncoder;
    @Value("${application.default-admin.email:admin@huuloc.id.vn}")
    private String defaultAdminEmail;
    @Value("${application.default-admin.password:admin}")
    private String defaultAdminPassword;

    @Override
    public UserResponse update(UserRequest userRequest) {
        UserWorkout user = userRepository.findByEmail(userRequest.getEmail())
                .orElseThrow(() ->
                        BadRequestException.message("User not found."));

        user.setFullName(userRequest.getFullName());
        user.setBirthday(userRequest.getBirthday());
        if (userRequest.getHealthyInfo() != null) {
            HealthyInfoDto healthyInfoDto = healthyService.updateHealthyInfo(user.getEmail(),
                    userRequest.getHealthyInfo());

            user.setHealthyInfo(
                    HealthyInfoMapper.INSTANCE.toHealthyInfo(healthyInfoDto)
            );
        }
        user.setUpdatedDate(LocalDateTime.now());

        userRepository.save(user);
        return UserMapper.INSTANCE.toDto(user);
    }

    @Override
    public UserResponse updatePassword(String email, ChangePasswordDto changePasswordDto) {
        UserWorkout user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        BadRequestException.message("User not found."));

        if (!StringUtils.hasText(changePasswordDto.getOldPassword()) ||
                !StringUtils.hasText(changePasswordDto.getNewPassword()) ||
                !StringUtils.hasText(changePasswordDto.getConfirmPassword())) {
            throw BadRequestException.message("Old password, new password, and confirm password are required.");
        }

        if (!changePasswordDto.getNewPassword().equals(changePasswordDto.getConfirmPassword())) {
            throw BadRequestException.message("New password and confirm password do not match.");
        }

        if (!passwordEncoder.matches(changePasswordDto.getOldPassword(),
                user.getPassword().replace("{bcrypt}", ""))) {
            throw BadRequestException.message("Old password is incorrect.");
        }

        user.setPassword("{bcrypt}" + passwordEncoder
                .encode(changePasswordDto.getNewPassword()));
        user.setUpdatedDate(LocalDateTime.now());

        userRepository.save(user);
        return UserMapper.INSTANCE.toDto(user);
    }

    @Override
    public UserResponse findByEmail(String email) {
        UserWorkout user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        BadRequestException.message("User not found."));

        user.setHealthyInfo(
                HealthyInfoMapper.INSTANCE.toHealthyInfo(healthyService.getHealthyInfo(email))
        );

        return UserMapper.INSTANCE.toDto(user);
    }

    @Override
    public Map<String, String> enableUser(String email) throws MessagingException {
        UserWorkout user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        BadRequestException.message("User not found."));

        if (user.isEnabled()) {
            return Map.of("message", "User is already enabled.");
        }

//        SendVerifyCodeHandle(user, emailService, verifyCodeRepository);

        return Map.of("message", "Code has been sent to your email.");
    }

    @Transactional
    @Override
    public void createData() {
        if (userRepository.count() > 0) {
            return;
        }

        Privilege readPrivilege = Privilege.builder().name("READ").build();
        Privilege writePrivilege = Privilege.builder().name("WRITE").build();
        Privilege deletePrivilege = Privilege.builder().name("DELETE").build();
        Privilege createWorkshopPrivilege = Privilege.builder().name("CREATE_WORKSHOP").build();

        if (privilegeRepository.count() == 0) {
            privilegeRepository.saveAll(List.of(
                    readPrivilege,
                    writePrivilege,
                    deletePrivilege,
                    createWorkshopPrivilege
            ));
        }
        if (roleRepository.count() == 0) {
            roleRepository.saveAll(List.of(
                    Role.builder()
                            .name(AppConstants.ROLE_USER)
                            .privileges(List.of(
                                    readPrivilege,
                                    writePrivilege
                            ))
                            .build(),
                    Role.builder()
                            .name(AppConstants.ROLE_ADMIN)
                            .privileges(List.of(
                                    readPrivilege,
                                    writePrivilege,
                                    deletePrivilege,
                                    createWorkshopPrivilege
                            ))
                            .build()
            ));
        }
        LocalDate birthday = LocalDate.of(2004, 5, 21);
        userRepository.save(UserWorkout.builder()
                .email(defaultAdminEmail)
                .password("{bcrypt}" + new BCryptPasswordEncoder(10)
                        .encode(defaultAdminPassword))
                .fullName("Admin")
                .enabled(true)
                .birthday(birthday)
                .roles(List.of(roleRepository.findByName(AppConstants.ROLE_ADMIN),
                        roleRepository.findByName(AppConstants.ROLE_USER)))
                .build());
    }
}
