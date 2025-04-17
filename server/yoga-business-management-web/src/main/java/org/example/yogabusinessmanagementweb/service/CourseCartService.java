package org.example.yogabusinessmanagementweb.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.example.yogabusinessmanagementweb.common.entities.CourseCart;
import org.example.yogabusinessmanagementweb.dto.request.cart.CartCreationRequest;
import org.example.yogabusinessmanagementweb.dto.request.cart.CartDeleteMultipleRequest;
import org.example.yogabusinessmanagementweb.dto.request.cart.CartDeleteRequest;
import org.example.yogabusinessmanagementweb.dto.request.cart.CartItemCreationRequest;
import org.example.yogabusinessmanagementweb.dto.request.course.CartCourseDeleteRequest;
import org.example.yogabusinessmanagementweb.dto.request.coursecart.AddToCartRequest;
import org.example.yogabusinessmanagementweb.dto.request.coursecart.CartCourseCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.cart.CartItemResponse;
import org.example.yogabusinessmanagementweb.dto.response.cart.CartResponse;
import org.example.yogabusinessmanagementweb.dto.response.coursecart.CourseCartResponse;

import java.util.List;

public interface CourseCartService {


    List<CourseCartResponse> showCart(HttpServletRequest request);
    CourseCart getCourseCartById(String id);

    CourseCartResponse removeFromCart(HttpServletRequest request, CartCourseDeleteRequest cartCourseDeleteRequest);
//    CartResponse removeMultiple(HttpServletRequest request, CartDeleteMultipleRequest cartDeleteMultipleRequest);
//
    CourseCartResponse addToCart(@Valid AddToCartRequest addToCartRequest, HttpServletRequest request);
    boolean checkCourseExist(List<CourseCart> courseCartResponse, String idCourse);
}
