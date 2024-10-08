package org.example.yogabusinessmanagementweb.yoga.dto.response;

import lombok.Getter;

@Getter
public class ApiResponse<T>  {
    private final int status;
    private final String message;
    private T data;

    public ApiResponse(int status, String message, T data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    public ApiResponse(int status, String message) {
        this.status = status;
        this.message = message;
    }
}
