package org.example.yogabusinessmanagementweb.controller.user.order;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.dto.request.order.OrderCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.ApiResponse;
import org.example.yogabusinessmanagementweb.dto.response.order.OrderCreationResponse;
import org.example.yogabusinessmanagementweb.repositories.UserRepository;
import org.example.yogabusinessmanagementweb.service.CartService;
import org.example.yogabusinessmanagementweb.service.Impl.AuthencationService;
import org.example.yogabusinessmanagementweb.service.OrderService;
import org.example.yogabusinessmanagementweb.service.ProductService;
import org.example.yogabusinessmanagementweb.service.UserService;
import org.example.yogabusinessmanagementweb.service.EmailService;
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
    public ApiResponse<?> createOrder(@Valid  @RequestBody OrderCreationRequest orderCreationRequest) {
        OrderCreationResponse orderCreationResponse =  orderService.createOrder(orderCreationRequest);
        return new ApiResponse<>(HttpStatus.OK.value(), "create order success");
    }
}
