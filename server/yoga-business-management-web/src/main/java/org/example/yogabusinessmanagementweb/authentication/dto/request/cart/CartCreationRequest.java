package org.example.yogabusinessmanagementweb.authentication.dto.request.cart;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class CartCreationRequest {
    String userId;
    String productId;
}
