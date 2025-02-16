package org.example.yogabusinessmanagementweb.workoutwithAI.utils;

import jakarta.mail.MessagingException;
import lombok.experimental.UtilityClass;
import org.apache.commons.lang3.time.DateUtils;
import org.example.yogabusinessmanagementweb.workoutwithAI.constant.AppConstants;
import org.example.yogabusinessmanagementweb.workoutwithAI.entity.UserWorkout;
import org.example.yogabusinessmanagementweb.workoutwithAI.entity.VerifyCode;
import org.example.yogabusinessmanagementweb.workoutwithAI.repository.VerifyCodeRepository;
import org.example.yogabusinessmanagementweb.workoutwithAI.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import static org.example.yogabusinessmanagementweb.workoutwithAI.constant.AppConstants.VERIFY_CODE_LENGTH;

@UtilityClass
public class AuthUtils {
    private static final Logger log = LoggerFactory.getLogger(AuthUtils.class);

    public static String generateVerifyCode() {
        String codeBase = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();
        for (int i = 0; i < VERIFY_CODE_LENGTH; i++) {
            int index = (int) (codeBase.length() * Math.random());
            codeBuilder.append(codeBase.charAt(index));
        }
        return codeBuilder.toString();
    }

    public static void SendVerifyCodeHandle(UserWorkout user, EmailService emailService,
                                            VerifyCodeRepository verifyCodeRepository) {
        Date expired = DateUtils.addMinutes(new Date(),
                AppConstants.VERIFY_CODE_EXPIRATION);
        LocalDateTime expiredAt = LocalDateTime.ofInstant(expired.toInstant(),
                ZoneId.systemDefault());

        var verifyCode = VerifyCode.builder()
                .user(user)
                .code(generateVerifyCode())
                .expiredAt(expiredAt)
                .build();
        verifyCodeRepository.save(verifyCode);

        // send mail in a new thread
        new Thread(() -> {
            try {
                emailService.sendVerifyCode(user.getEmail(), verifyCode.getCode());
            } catch (MessagingException ignored) {
                log.error(ignored.getMessage());
                log.error("Failed to send verify code email to {}", user.getEmail());
            }
        }).start();
    }
}
