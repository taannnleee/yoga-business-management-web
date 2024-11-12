package org.example.yogabusinessmanagementweb.dto.request.cartitem;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.Map;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class CartItemCreationRequest {
    String id;

    String productId;
    int quantity;

}
