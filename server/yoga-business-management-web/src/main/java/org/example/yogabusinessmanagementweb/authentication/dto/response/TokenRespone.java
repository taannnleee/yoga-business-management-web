package org.example.yogabusinessmanagementweb.authentication.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.io.Serializable;

@Getter
@AllArgsConstructor
@Builder

public class TokenRespone implements Serializable {
    private String accesstoken;
    private String refreshtoken;
    private long userid;
}
