package org.example.yogabusinessmanagementweb.yoga.exception;

import org.example.yogabusinessmanagementweb.yoga.dto.response.ApiResponse;
import org.example.yogabusinessmanagementweb.yoga.dto.response.ValidationErrorResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.List;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(value = Exception.class)
    ResponseEntity<ApiResponse> handlingRuntimeException(RuntimeException e) {
        ApiResponse apiResponse = new ApiResponse(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode(),e.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }
    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse> handlingAppException(AppException e) {
        ErrorCode errorCode = e.getErrorCode();
        ApiResponse apiResponse = new ApiResponse(errorCode.getCode(),errorCode.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<List<ValidationErrorResponse>>> handlingMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        List<ValidationErrorResponse> errors = e.getBindingResult()
                .getAllErrors()
                .stream()
                .map(error -> new ValidationErrorResponse(
                        ((FieldError) error).getField(),
                        error.getDefaultMessage()
                ))
                .collect(Collectors.toList());

        ApiResponse<List<ValidationErrorResponse>> apiResponse = new ApiResponse<>(ErrorCode.MISSING_FIELD_REQUIRED.getCode(),ErrorCode.MISSING_FIELD_REQUIRED.getMessage(),errors);

        return ResponseEntity.badRequest().body(apiResponse);
    }

}
