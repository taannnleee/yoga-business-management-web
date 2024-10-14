package org.example.yogabusinessmanagementweb.dto.response.product;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class AddProductResponse {
    Long id;
    String title;
    String imagePath;
    Long subCategoryId;
    Double averageRating;
    BigDecimal price;
    ProductDetailResponse productDetail;
}
