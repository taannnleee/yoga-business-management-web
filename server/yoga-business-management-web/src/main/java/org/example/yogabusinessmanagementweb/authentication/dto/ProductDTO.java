package org.example.yogabusinessmanagementweb.authentication.dto;

import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.entities.ProductDetail;
import org.example.yogabusinessmanagementweb.common.entities.SubCategory;

import java.math.BigDecimal;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class ProductDTO {
    String status;
    String title;
    ProductDetailDTO productDetail;
}
