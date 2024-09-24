package org.example.yogabusinessmanagementweb.authentication.exception;

import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

@RestControllerAdvice
public class GlobalExceptionHandle {
    public ErrorResponse handleValidationException(Exception e, WebRequest request){
        ErrorResponse errorResponse =  new ErrorResponse();
        return  errorResponse;
    }
}
