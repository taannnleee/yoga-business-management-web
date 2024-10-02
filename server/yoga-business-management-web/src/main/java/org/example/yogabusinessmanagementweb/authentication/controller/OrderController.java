package org.example.yogabusinessmanagementweb.authentication.controller;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.authentication.dto.request.cart.CartCreationRequest;
import org.example.yogabusinessmanagementweb.authentication.dto.request.order.OrderCreationRequest;
import org.example.yogabusinessmanagementweb.authentication.dto.response.ResponseData;
import org.example.yogabusinessmanagementweb.authentication.dto.response.cart.CartResponse;
import org.example.yogabusinessmanagementweb.authentication.dto.response.order.OrderCreationResponse;
import org.example.yogabusinessmanagementweb.authentication.repositories.UserRepository;
import org.example.yogabusinessmanagementweb.authentication.service.CartService;
import org.example.yogabusinessmanagementweb.authentication.service.Impl.AuthencationService;
import org.example.yogabusinessmanagementweb.authentication.service.OrderService;
import org.example.yogabusinessmanagementweb.authentication.service.ProductService;
import org.example.yogabusinessmanagementweb.authentication.service.UserService;
import org.example.yogabusinessmanagementweb.sendEmail.service.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/order")
@Slf4j
public class OrderController {
    UserService userService;
    UserRepository userRepository;
    EmailService emailService;
    AuthencationService authencationService;
    ProductService productService;
    CartService cartService;
    OrderService orderService;

    @PostMapping("/create-order")
    public ResponseData<?> createOrder(@RequestBody OrderCreationRequest orderCreationRequest) {
        OrderCreationResponse orderCreationResponse =  orderService.createOrder(orderCreationRequest);
        return new ResponseData<>(HttpStatus.OK.value(), "create order success",orderCreationResponse);
    }
}
