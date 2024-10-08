package org.example.yogabusinessmanagementweb.yoga.controller.user.order;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.yoga.dto.request.order.OrderCreationRequest;
import org.example.yogabusinessmanagementweb.yoga.dto.response.ApiResponse;
import org.example.yogabusinessmanagementweb.yoga.dto.response.order.OrderCreationResponse;
import org.example.yogabusinessmanagementweb.yoga.repositories.UserRepository;
import org.example.yogabusinessmanagementweb.yoga.service.CartService;
import org.example.yogabusinessmanagementweb.yoga.service.Impl.AuthencationService;
import org.example.yogabusinessmanagementweb.yoga.service.OrderService;
import org.example.yogabusinessmanagementweb.yoga.service.ProductService;
import org.example.yogabusinessmanagementweb.yoga.service.UserService;
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
    public ApiResponse<?> createOrder(@RequestBody OrderCreationRequest orderCreationRequest) {
        OrderCreationResponse orderCreationResponse =  orderService.createOrder(orderCreationRequest);
        return new ApiResponse<>(HttpStatus.OK.value(), "create order success");
    }
}
