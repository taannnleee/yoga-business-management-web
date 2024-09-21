package org.example.yogabusinessmanagementweb.authentication.dto.request;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
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
