package org.example.yogabusinessmanagementweb.authentication.service;

import org.example.yogabusinessmanagementweb.authentication.dto.request.cart.CartCreationRequest;
import org.example.yogabusinessmanagementweb.authentication.dto.response.cart.CartResponse;

public interface CartService {
    CartResponse addToCart(CartCreationRequest cartCreationRequest);

    CartResponse showCart(String cartId);

    CartResponse subtractFromCartItem(CartCreationRequest cartCreationRequest);

    CartResponse removeFromCart(CartCreationRequest cartCreationRequest);
}
