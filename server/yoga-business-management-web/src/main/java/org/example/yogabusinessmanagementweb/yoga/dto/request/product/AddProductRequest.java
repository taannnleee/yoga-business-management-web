package org.example.yogabusinessmanagementweb.yoga.dto.request.product;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.yoga.dto.ProductDetailDTO;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class AddProductRequest {
    String title;
    Long subCategoryId;
    Double averageRating;
    ProductDetailDTO productDetail;

}
