package org.example.yogabusinessmanagementweb.dto.request.cart;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class CartDeleteMultipleRequest {
    @NotNull(message = "Product id is required")
    List<String> cartItemIds;
}
