package org.example.yogabusinessmanagementweb.authentication.dto.response;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class RegistrationResponse {
    Long id;
    String username;
    String email;
    String status;
}
