package org.example.yogabusinessmanagementweb.authentication.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(1001, "Uncategorized error"),
    MISSING_FIELD_REQUIRED(1002, "Missing required field"),
    INVAlID_KEY(1003, "Invalid message key"),
    ASSIGNMENT_NOT_FOUND(1004, "Assignment not found"),
    CLASS_NOT_FOUND(1005, "Class not found"),
    TRAINING_PROGRAM_NOT_FOUND(1005, "Training program not found"),
    LOCATION_NOT_FOUND(1006, "Location not found"),
    SYLLABUS_NOT_FOUND(1007,"Syllabus not found"),
    ADDRESS_NOT_FOUND(1008, "Address not found"),
    USER_NOT_FOUND(1009, "User not found"),

    TOKEN_INVALID(1010, "Token is invalid"),
    PASS_WORD_NOT_MATCHED(1011, "Password word not matched"),
    TOKEN_EMPTY(1012, "Token is empty"),
    USER_NOT_ACTIVE(1013, "User is not active"),
    TOKEN_NOT_FOUND(1014, "Token not found"),
    OTP_INVALID(1015, "OTP is invalid"),
    PRODUCT_NOT_FOUND(1016, "Product not found"),
    USERNAME_ALREADY_EXISTS(1017, "Username already exists"),
    PHONE_ALREADY_EXISTS(1018, "Phone already exists"),
    EMAIL_ALREADY_EXISTS(1019, "Email already exists"),

    CART_NOT_FOUND(1020, "Cart not found"),
    PRODUCT_NOT_EXISTS(1021, "Product not exists"),



    INVALID_CREDENTIALS(1022,"Invalid credentials" ),;

    // MODULE ERROR

    // CLASS ERROR

    // TRAINING PROGRAM ERROR
    int code;
    String message;
}
