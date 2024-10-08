package org.example.yogabusinessmanagementweb.yoga.dto.request.user;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)

public class LoginRequest implements Serializable {
    String username;
    String password;
}
