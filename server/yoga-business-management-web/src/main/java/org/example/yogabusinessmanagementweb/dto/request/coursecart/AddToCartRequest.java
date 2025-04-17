package org.example.yogabusinessmanagementweb.dto.request.coursecart;



import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.Map;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class AddToCartRequest {
    @NotNull(message = "Product id is required")
    String courseId;
}
