package org.example.yogabusinessmanagementweb.yoga.dto;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class ProductDTO {
    String status;
    String title;
    ProductDetailDTO productDetail;
}
