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
    INVAlID_KEY(1002, "Invalid message key"),
    ASSIGNMENT_NOT_FOUND(1004, "Assignment not found"),
    CLASS_NOT_FOUND(1004, "Class not found"),
    TRAINING_PROGRAM_NOT_FOUND(1005, "Training program not found"),
    LOCATION_NOT_FOUND(1006, "Location not found"),
    SYLLABUS_NOT_FOUND(1007,"Syllabus not found")







    ;

    // MODULE ERROR

    // CLASS ERROR

    // TRAINING PROGRAM ERROR
    int code;
    String message;
}
