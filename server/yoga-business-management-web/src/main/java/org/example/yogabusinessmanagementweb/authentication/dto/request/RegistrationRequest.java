package org.example.yogabusinessmanagementweb.authentication.dto.request;

import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class RegistrationRequest {
    String username;
    String fullname;
    String email;
    String phone;
    String password;
    String confirmpassword;
    Date dateOfBirth;
    String gender;
    String status;

}
