package org.example.yogabusinessmanagementweb.authentication.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class ProfileResponse implements Serializable {
    private String fullname;
    private String username;
    private String email;
    private String phone;

    private String street;
    private String city;
    private String state;
}
