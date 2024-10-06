package org.example.yogabusinessmanagementweb.authentication.dto.response.category;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class SubCategoryResponse {
    Long id;
    String name;
}
