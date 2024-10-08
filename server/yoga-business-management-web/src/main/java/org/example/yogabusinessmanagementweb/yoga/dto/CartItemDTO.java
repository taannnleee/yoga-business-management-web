package org.example.yogabusinessmanagementweb.yoga.dto;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class CartItemDTO {
    int quantity;
    BigDecimal totalPrice;
    ProductDTO product;
}
