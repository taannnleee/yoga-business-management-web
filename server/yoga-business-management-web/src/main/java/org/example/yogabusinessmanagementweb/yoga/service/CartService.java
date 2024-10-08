package org.example.yogabusinessmanagementweb.yoga.service;

import jakarta.servlet.http.HttpServletRequest;
import org.example.yogabusinessmanagementweb.yoga.dto.request.cart.CartCreationRequest;
import org.example.yogabusinessmanagementweb.yoga.dto.response.cart.CartResponse;

public interface CartService {
    CartResponse addToCart(CartCreationRequest cartCreationRequest, HttpServletRequest request);

    CartResponse showCart(String cartId);

    CartResponse subtractFromCartItem(CartCreationRequest cartCreationRequest);

    CartResponse removeFromCart(CartCreationRequest cartCreationRequest);
}
