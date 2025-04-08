package org.example.yogabusinessmanagementweb.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.example.yogabusinessmanagementweb.common.entities.CourseCart;
import org.example.yogabusinessmanagementweb.dto.request.cart.CartCreationRequest;
import org.example.yogabusinessmanagementweb.dto.request.cart.CartDeleteMultipleRequest;
import org.example.yogabusinessmanagementweb.dto.request.cart.CartDeleteRequest;
import org.example.yogabusinessmanagementweb.dto.request.cart.CartItemCreationRequest;
import org.example.yogabusinessmanagementweb.dto.request.coursecart.CartCourseCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.cart.CartItemResponse;
import org.example.yogabusinessmanagementweb.dto.response.cart.CartResponse;

import java.util.List;

public interface CourseCartService {


    List<CourseCart> showCart(HttpServletRequest request);
    CartItemResponse increaseToCart(CartCourseCreationRequest cartCourseCreationRequest, HttpServletRequest request);
//    CartItemResponse subtractFromCartItem(CartItemCreationRequest cartItemCreationRequest, HttpServletRequest request);
//
//    CartResponse removeFromCart(HttpServletRequest request, CartDeleteRequest cartCreationRequest);
//    CartResponse removeMultiple(HttpServletRequest request, CartDeleteMultipleRequest cartDeleteMultipleRequest);
//
    CourseCart addToCart(@Valid CartCreationRequest cartCreationRequest, HttpServletRequest request);
}
