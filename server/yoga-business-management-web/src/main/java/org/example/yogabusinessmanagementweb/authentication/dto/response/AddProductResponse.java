package org.example.yogabusinessmanagementweb.authentication.dto.response;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.authentication.dto.ProductDetailDTO;
@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class AddProductResponse {
    Long id;
    String status;
    ProductDetailDTO productDetail;
    Long categoryId;
}
