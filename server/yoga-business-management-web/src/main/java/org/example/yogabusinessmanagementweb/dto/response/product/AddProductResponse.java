package org.example.yogabusinessmanagementweb.dto.response.product;

import jakarta.persistence.Column;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.entities.models.ProductVariants;

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
    String code;
    String brand;
    String description;

    private ProductVariants variantList;
}
