package org.example.yogabusinessmanagementweb.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.example.yogabusinessmanagementweb.common.entities.CartItem;
import org.example.yogabusinessmanagementweb.dto.request.cart.CartCreationRequest;
import org.example.yogabusinessmanagementweb.dto.request.cart.CartDeleteRequest;
import org.example.yogabusinessmanagementweb.dto.request.cartitem.CartItemCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.cart.CartResponse;
import org.example.yogabusinessmanagementweb.dto.response.cartitem.CartItemResponse;

public interface CartService {
    CartItemResponse increaseToCart(CartItemCreationRequest cartItemCreationRequest, HttpServletRequest request);

    CartResponse showCart(HttpServletRequest request);

    CartItemResponse subtractFromCartItem(CartItemCreationRequest cartItemCreationRequest, HttpServletRequest request);

    CartResponse removeFromCart(HttpServletRequest request, CartDeleteRequest cartCreationRequest);

    CartResponse addToCart(@Valid CartCreationRequest cartCreationRequest, HttpServletRequest request);
}
