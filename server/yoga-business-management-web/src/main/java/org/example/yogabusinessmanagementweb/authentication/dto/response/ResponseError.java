package org.example.yogabusinessmanagementweb.authentication.dto.response;

import lombok.Getter;

@Getter
public class ResponseError extends ResponseData{
    public ResponseError(int status, String message) {
        super(status, message);
    }
}
