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
    String name;
    String imagePath;
    String description;
    BigDecimal price;
    String color;
    String size;
    String code;
    String brand;

}
