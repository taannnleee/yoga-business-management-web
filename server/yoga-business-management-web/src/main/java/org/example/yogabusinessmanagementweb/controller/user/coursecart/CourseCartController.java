package org.example.yogabusinessmanagementweb.controller.user.coursecart;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.common.entities.CourseCart;
import org.example.yogabusinessmanagementweb.dto.request.cart.CartCreationRequest;
import org.example.yogabusinessmanagementweb.dto.request.cart.CartDeleteMultipleRequest;
import org.example.yogabusinessmanagementweb.dto.request.cart.CartDeleteRequest;
import org.example.yogabusinessmanagementweb.dto.request.cart.CartItemCreationRequest;
import org.example.yogabusinessmanagementweb.dto.request.coursecart.CartCourseCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.ApiResponse;
import org.example.yogabusinessmanagementweb.dto.response.cart.CartItemResponse;
import org.example.yogabusinessmanagementweb.dto.response.cart.CartResponse;
import org.example.yogabusinessmanagementweb.dto.response.topic.TopicCourseResponse;
import org.example.yogabusinessmanagementweb.service.CartService;
import org.example.yogabusinessmanagementweb.service.CourseCartService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/course/cart")
@Slf4j
public class CourseCartController {
    CourseCartService courseCartService;
    CartService cartService;

    @PostMapping("/increase-to-cart")
    public ApiResponse<?> increaseToCart(HttpServletRequest request, @Valid @RequestBody CartCourseCreationRequest cartCourseCreationRequest) {
        CartItemResponse cartItem =  courseCartService.increaseToCart(cartCourseCreationRequest,request);
        return new ApiResponse<>(HttpStatus.OK.value(), "increase to cart item success",cartItem);
    }
//
//    @PostMapping("/subtract-from-cart-item")
//    public ApiResponse<?> subtractFromCartItem(HttpServletRequest request,@Valid @RequestBody CartItemCreationRequest cartItemCreationRequest) {
//        CartItemResponse cartItem =  cartService.subtractFromCartItem(cartItemCreationRequest, request);
//        return new ApiResponse<>(HttpStatus.OK.value(), "subtract from cart success",cartItem);
//    }
//
//    @PostMapping("/remove-from-cart")
//    public ApiResponse<?> removeFromCart(HttpServletRequest request,@Valid @RequestBody CartDeleteRequest cartDeleteRequest) {
//        CartResponse cartResponse =  cartService.removeFromCart(request,cartDeleteRequest);
//        return new ApiResponse<>(HttpStatus.OK.value(), "remove from cart item success",cartResponse);
//    }
//    @PostMapping("/remove-multiple")
//    public ApiResponse<?> removeMultiple(HttpServletRequest request,@Valid @RequestBody CartDeleteMultipleRequest cartDeleteMultipleRequest) {
//        CartResponse cartResponse =  cartService.removeMultiple(request,cartDeleteMultipleRequest);
//        return new ApiResponse<>(HttpStatus.OK.value(), "remove from cart item success",cartResponse);
//    }

    @GetMapping("/show-cart")
    public ApiResponse<?> showCart(HttpServletRequest request) {
        List<CourseCart> courseCart = courseCartService.showCart(request);
        return new ApiResponse<>(HttpStatus.OK.value(), "show cart success",courseCart);
    }

    @PostMapping("/add-to-cart")
    public ApiResponse<?> addToCart(HttpServletRequest request,@Valid @RequestBody CartCreationRequest cartCreationRequest) {
        CourseCart cartResponse =  courseCartService.addToCart(cartCreationRequest,request);
        return new ApiResponse<>(HttpStatus.OK.value(), "add to cart success",cartResponse);
    }
}
