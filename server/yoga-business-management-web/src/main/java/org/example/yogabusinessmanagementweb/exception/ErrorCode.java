package org.example.yogabusinessmanagementweb.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error",HttpStatus.INTERNAL_SERVER_ERROR),
    UNAUTHENTICATED(9000, "Unauthenticated", HttpStatus.UNAUTHORIZED),

    UNAUTHORIZED(9001, "You do not have permission to access this resource", HttpStatus.FORBIDDEN),
    MISSING_FIELD_REQUIRED(1002, "Missing required field",HttpStatus.BAD_REQUEST),
    INVAlID_KEY(1003, "Invalid message key",HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1009, "User not found",HttpStatus.NOT_FOUND),

    TOKEN_INVALID(1010, "Token is invalid",HttpStatus.BAD_REQUEST),
    PASS_WORD_NOT_MATCHED(1011, "Password word not matched",HttpStatus.BAD_REQUEST),
    TOKEN_EMPTY(1012, "Token is empty",HttpStatus.NOT_FOUND),
    USER_NOT_ACTIVE(1013, "User is not active",HttpStatus.BAD_REQUEST),
    TOKEN_NOT_FOUND(1014, "Token not found",HttpStatus.NOT_FOUND),
    OTP_INVALID(1015, "OTP is invalid",HttpStatus.BAD_REQUEST),
    PRODUCT_NOT_FOUND(1016, "Product not found",HttpStatus.NOT_FOUND),
    USERNAME_ALREADY_EXISTS(1017, "Username already exists",HttpStatus.BAD_REQUEST),
    PHONE_ALREADY_EXISTS(1018, "Phone already exists",HttpStatus.BAD_REQUEST),
    EMAIL_ALREADY_EXISTS(1019, "Email already exists",HttpStatus.BAD_REQUEST),

    CART_NOT_FOUND(1020, "Cart not found",HttpStatus.NOT_FOUND),
    PRODUCT_NOT_EXISTS(1021, "Product not exists",HttpStatus.NOT_FOUND),
    SUBCATEGORY_NOT_FOUND(1022, "Subcategory not found",HttpStatus.NOT_FOUND),

    CATEGORY_EXISTS(1023, "Category already exists",HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_FOUND(1024, "Category not found",HttpStatus.NOT_FOUND),


    INVALID_CREDENTIALS(1022,"Invalid credentials",HttpStatus.BAD_REQUEST ),;

    // MODULE ERROR

    // CLASS ERROR

    // TRAINING PROGRAM ERROR
    int code;
    String message;
    HttpStatus statusCode;
}