package org.example.yogabusinessmanagementweb.authentication.exception;

import org.example.yogabusinessmanagementweb.authentication.dto.response.ResponseData;
import org.example.yogabusinessmanagementweb.authentication.dto.response.ValidationErrorResponse;
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
    ResponseEntity<ResponseData> handlingRuntimeException(RuntimeException e) {
        ResponseData apiResponse = new ResponseData(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode(),e.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }
    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ResponseData> handlingAppException(AppException e) {
        ErrorCode errorCode = e.getErrorCode();
        ResponseData apiResponse = new ResponseData(errorCode.getCode(),errorCode.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseEntity<ResponseData<List<ValidationErrorResponse>>> handlingMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        List<ValidationErrorResponse> errors = e.getBindingResult()
                .getAllErrors()
                .stream()
                .map(error -> new ValidationErrorResponse(
                        ((FieldError) error).getField(),
                        error.getDefaultMessage()
                ))
                .collect(Collectors.toList());

        ResponseData<List<ValidationErrorResponse>> apiResponse = new ResponseData<>(ErrorCode.MISSING_FIELD_REQUIRED.getCode(),ErrorCode.MISSING_FIELD_REQUIRED.getMessage(),errors);

        return ResponseEntity.badRequest().body(apiResponse);
    }

}
