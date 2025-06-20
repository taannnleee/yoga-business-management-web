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
import org.example.yogabusinessmanagementweb.dto.request.course.CartCourseDeleteRequest;
import org.example.yogabusinessmanagementweb.dto.request.coursecart.AddToCartRequest;
import org.example.yogabusinessmanagementweb.dto.request.coursecart.CartCourseCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.ApiResponse;
import org.example.yogabusinessmanagementweb.dto.response.cart.CartItemResponse;
import org.example.yogabusinessmanagementweb.dto.response.cart.CartResponse;
import org.example.yogabusinessmanagementweb.dto.response.coursecart.CourseCartResponse;
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


    @PostMapping("/remove-from-cart")
    public ApiResponse<?> removeFromCart(HttpServletRequest request,@Valid @RequestBody CartCourseDeleteRequest cartCourseDeleteRequest) {
        CourseCartResponse cartResponse =  courseCartService.removeFromCart(request,cartCourseDeleteRequest);
        return new ApiResponse<>(HttpStatus.OK.value(), "remove from cart item success",cartResponse);
    }

    @GetMapping("/show-cart")
    public ApiResponse<?> showCart(HttpServletRequest request) {
        List<CourseCartResponse> courseCart = courseCartService.showCart(request);
        return new ApiResponse<>(HttpStatus.OK.value(), "show cart success",courseCart);
    }

    @PostMapping("/add-to-cart")
    public ApiResponse<?> addToCart(HttpServletRequest request,@Valid @RequestBody AddToCartRequest addToCartRequest) {
        CourseCartResponse cartResponse =  courseCartService.addToCart(addToCartRequest,request);
        return new ApiResponse<>(HttpStatus.OK.value(), "add to cart success",cartResponse);
    }
}
