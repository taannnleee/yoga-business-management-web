package org.example.yogabusinessmanagementweb.yoga.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.yoga.dto.request.cart.CartCreationRequest;
import org.example.yogabusinessmanagementweb.yoga.dto.response.ApiResponse;
import org.example.yogabusinessmanagementweb.yoga.dto.response.cart.CartResponse;
import org.example.yogabusinessmanagementweb.yoga.repositories.UserRepository;
import org.example.yogabusinessmanagementweb.yoga.service.CartService;
import org.example.yogabusinessmanagementweb.yoga.service.Impl.AuthencationService;
import org.example.yogabusinessmanagementweb.yoga.service.ProductService;
import org.example.yogabusinessmanagementweb.yoga.service.UserService;
import org.example.yogabusinessmanagementweb.sendEmail.service.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/cart")
@Slf4j
public class CartController {
    UserService userService;
    UserRepository userRepository;
    EmailService emailService;
    AuthencationService authencationService;
    ProductService productService;
    CartService cartService;

    @PostMapping("/add-to-cart")
    public ApiResponse<?> addToCart(HttpServletRequest request, @RequestBody CartCreationRequest cartCreationRequest) {
        CartResponse cartResponse =  cartService.addToCart(cartCreationRequest,request);
        return new ApiResponse<>(HttpStatus.OK.value(), "add to cart success",cartResponse);
    }

    @PostMapping("/subtract-from-cart-item")
    public ApiResponse<?> subtractFromCartItem(@RequestBody CartCreationRequest cartCreationRequest) {
        CartResponse cartResponse =  cartService.subtractFromCartItem(cartCreationRequest);
        return new ApiResponse<>(HttpStatus.OK.value(), "subtract from cart success",cartResponse);
    }

    @PostMapping("/remove-from-cart")
    public ApiResponse<?> removeFromCart(@RequestBody CartCreationRequest cartCreationRequest) {
        CartResponse cartResponse =  cartService.removeFromCart(cartCreationRequest);
        return new ApiResponse<>(HttpStatus.OK.value(), "remove from cart success",cartResponse);
    }

    @GetMapping("/show-cart/{cartId}")
    public ApiResponse<?> showCart(@PathVariable String cartId) {
        CartResponse cartResponse = cartService.showCart(cartId);
        return new ApiResponse<>(HttpStatus.OK.value(), "show cart success",cartResponse);
    }
}
