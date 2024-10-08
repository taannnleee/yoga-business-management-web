package org.example.yogabusinessmanagementweb.dto.response.subcategory;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.entities.Category;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class SubCategoryResponse {
    Long id;
    String name;
    String status;

}
