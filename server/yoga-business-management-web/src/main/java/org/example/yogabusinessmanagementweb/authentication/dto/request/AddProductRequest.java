package org.example.yogabusinessmanagementweb.authentication.dto.request;

import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.authentication.dto.ProductDetailDTO;
import org.example.yogabusinessmanagementweb.common.entities.ProductDetail;
import org.example.yogabusinessmanagementweb.common.entities.Rating;
import org.example.yogabusinessmanagementweb.common.entities.SubCategory;

import java.util.List;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class AddProductRequest {
    String title;
    Long subCategoryId;
    Double averageRating;
    ProductDetailDTO productDetail;

}
