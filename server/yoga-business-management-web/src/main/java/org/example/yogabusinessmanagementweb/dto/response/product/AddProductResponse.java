package org.example.yogabusinessmanagementweb.dto.response.product;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class AddProductResponse {
    Long id;
    Long subCategoryId;
    Double averageRating;
    ProductDetailResponse productDetail;
}
