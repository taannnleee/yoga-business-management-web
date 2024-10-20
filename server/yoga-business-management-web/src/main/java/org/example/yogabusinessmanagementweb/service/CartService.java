package org.example.yogabusinessmanagementweb.service;

import jakarta.servlet.http.HttpServletRequest;
import org.example.yogabusinessmanagementweb.dto.request.cart.CartCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.cart.CartResponse;

public interface CartService {
    CartResponse addToCart(CartCreationRequest cartCreationRequest, HttpServletRequest request);

    CartResponse showCart(String cartId);

    CartResponse subtractFromCartItem(CartCreationRequest cartCreationRequest);

    CartResponse removeFromCart(CartCreationRequest cartCreationRequest);
}
