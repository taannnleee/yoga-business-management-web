package org.example.yogabusinessmanagementweb.dto.request.course;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class CourseRequest {
    Long id;
    String name;
    String description;
    String imagePath;
}
