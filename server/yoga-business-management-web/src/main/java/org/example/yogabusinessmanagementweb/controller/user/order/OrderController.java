package org.example.yogabusinessmanagementweb.controller.user.order;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.common.entities.Order;
import org.example.yogabusinessmanagementweb.dto.request.order.OrderCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.ApiResponse;
import org.example.yogabusinessmanagementweb.dto.response.cart.CartResponse;
import org.example.yogabusinessmanagementweb.dto.response.order.OrderCreationResponse;
import org.example.yogabusinessmanagementweb.dto.response.order.OrderResponse;
import org.example.yogabusinessmanagementweb.repositories.UserRepository;
import org.example.yogabusinessmanagementweb.service.CartService;
import org.example.yogabusinessmanagementweb.service.Impl.AuthencationService;
import org.example.yogabusinessmanagementweb.service.OrderService;
import org.example.yogabusinessmanagementweb.service.ProductService;
import org.example.yogabusinessmanagementweb.service.UserService;
import org.example.yogabusinessmanagementweb.service.EmailService;
import org.springframework.http.HttpRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ApiResponse<?> createOrder(HttpServletRequest request,@RequestBody OrderCreationRequest orderRequest) {
//        System.out.println("Shipping Info: " + orderRequest.getShippingInfo());
//        System.out.println("Payment Method: " + orderRequest.getPaymentMethod());
//        System.out.println("Products: " + orderRequest.getProducts());
//        System.out.println("Total Price: " + orderRequest.getTotalPrice());


        OrderCreationResponse orderCreationResponse =  orderService.createOrder(request,orderRequest);
        return new ApiResponse<>(HttpStatus.OK.value(), "create order success");
    }

    @GetMapping("/get-all-order")
    public ApiResponse<?> getAllOrder(HttpServletRequest request) {
        List<Order> orderResponse = orderService.showOrder(request);
        return new ApiResponse<>(HttpStatus.OK.value(), "show order success",orderResponse);
    }
}
