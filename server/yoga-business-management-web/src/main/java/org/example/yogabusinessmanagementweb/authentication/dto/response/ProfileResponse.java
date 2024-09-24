package org.example.yogabusinessmanagementweb.authentication.dto.response;

import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class ProfileResponse implements Serializable {
    String fullname;
    String username;
    String email;
    String phone;

    String street;
    String city;
    String state;
}
