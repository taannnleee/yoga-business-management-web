package org.example.yogabusinessmanagementweb.dto.request.coursecart;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class CartCourseCreationRequest {
    String id;
    String courseId;
    int quantity;

}
