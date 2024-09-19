package org.example.yogabusinessmanagementweb.authentication.dto.request;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ResetPasswordDTO {
//    private String secretKey;
    private String email;
    private String password;
    private String confirmPassword;
}
