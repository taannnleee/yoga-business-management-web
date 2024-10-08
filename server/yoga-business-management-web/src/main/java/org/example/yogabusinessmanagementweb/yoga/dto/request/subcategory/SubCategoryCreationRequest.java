package org.example.yogabusinessmanagementweb.yoga.dto.request.subcategory;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class SubCategoryCreationRequest {
    Long id;
    String name;
    String status;
    Long categoryId;
}
