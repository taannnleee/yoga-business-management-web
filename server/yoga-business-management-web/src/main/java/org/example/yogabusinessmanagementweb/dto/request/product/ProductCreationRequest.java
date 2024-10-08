package org.example.yogabusinessmanagementweb.dto.request.product;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.dto.response.product.ProductDetailResponse;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class ProductCreationRequest {
    @NotNull(message = "Title is required")
    String title;
    @NotNull(message = "Sub Category Id is required")
    Long subCategoryId;
    Double averageRating = 0.0;
    @NotNull(message = "Product Detail is required")
    ProductDetailCreationRequest productDetail;
}
