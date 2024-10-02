package org.example.yogabusinessmanagementweb.authentication.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.authentication.dto.request.UpdateProfileRequest;
import org.example.yogabusinessmanagementweb.authentication.dto.request.cart.CartCreationRequest;
import org.example.yogabusinessmanagementweb.authentication.dto.response.ResponseData;
import org.example.yogabusinessmanagementweb.authentication.dto.response.cart.CartResponse;
import org.example.yogabusinessmanagementweb.authentication.repositories.UserRepository;
import org.example.yogabusinessmanagementweb.authentication.service.CartService;
import org.example.yogabusinessmanagementweb.authentication.service.Impl.AuthencationService;
import org.example.yogabusinessmanagementweb.authentication.service.ProductService;
import org.example.yogabusinessmanagementweb.authentication.service.UserService;
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
    public ResponseData<?> addToCart(@RequestBody CartCreationRequest cartCreationRequest) {
        CartResponse cartResponse =  cartService.addToCart(cartCreationRequest);
        return new ResponseData<>(HttpStatus.OK.value(), "add to cart success",cartResponse);
    }

    @PostMapping("/subtract-from-cart-item")
    public ResponseData<?> subtractFromCartItem(@RequestBody CartCreationRequest cartCreationRequest) {
        CartResponse cartResponse =  cartService.subtractFromCartItem(cartCreationRequest);
        return new ResponseData<>(HttpStatus.OK.value(), "subtract from cart success",cartResponse);
    }

    @PostMapping("/remove-from-cart")
    public ResponseData<?> removeFromCart(@RequestBody CartCreationRequest cartCreationRequest) {
        CartResponse cartResponse =  cartService.removeFromCart(cartCreationRequest);
        return new ResponseData<>(HttpStatus.OK.value(), "remove from cart success",cartResponse);
    }

    @GetMapping("/show-cart/{cartId}")
    public ResponseData<?> showCart(@PathVariable String cartId) {
        CartResponse cartResponse = cartService.showCart(cartId);
        return new ResponseData<>(HttpStatus.OK.value(), "show cart success",cartResponse);
    }
}
