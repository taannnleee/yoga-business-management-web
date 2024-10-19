package org.example.yogabusinessmanagementweb.dto.response.product;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.entities.SubCategory;
import org.example.yogabusinessmanagementweb.dto.response.subcategory.SubCategoryResponse;

import java.math.BigDecimal;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class ProductResponse {
    Long id;
    String title;
    Double averageRating;
    BigDecimal price;
    String imagePath;
    String status;
    SubCategoryResponse subCategory;
}
