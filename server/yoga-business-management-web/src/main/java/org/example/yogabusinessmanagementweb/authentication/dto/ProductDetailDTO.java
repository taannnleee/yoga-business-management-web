package org.example.yogabusinessmanagementweb.authentication.dto;

import jakarta.persistence.Column;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class ProductDetailDTO {
    Long  id;
    String name;
    String imagePath;
    String description;
    BigDecimal price;
    String material;
    String dimensions;
    String thickness;
    String weight;
    String color;
}
