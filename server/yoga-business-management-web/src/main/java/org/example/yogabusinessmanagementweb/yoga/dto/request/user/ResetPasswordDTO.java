package org.example.yogabusinessmanagementweb.yoga.dto.request.user;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class ResetPasswordDTO {
//    private String secretKey;
    String email;
    String password;
    String confirmPassword;
}
