package org.example.yogabusinessmanagementweb.yoga.controller;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.yoga.dto.response.ApiResponse;
import org.example.yogabusinessmanagementweb.yoga.repositories.UserRepository;
import org.example.yogabusinessmanagementweb.yoga.service.Impl.AuthencationService;
import org.example.yogabusinessmanagementweb.yoga.service.ProductService;
import org.example.yogabusinessmanagementweb.yoga.service.UserService;
import org.example.yogabusinessmanagementweb.common.entities.Product;
import org.example.yogabusinessmanagementweb.sendEmail.service.EmailService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/home")
@Slf4j
public class HomeController {
    UserService userService;
    UserRepository userRepository;
    EmailService emailService;
    AuthencationService authencationService;
    ProductService productService;

    @GetMapping("/getAllProduct")
    public ApiResponse<?> getAllProduct(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) { // Nhận từ khóa tìm kiếm từ request
        try {
            Pageable pageable = PageRequest.of(page - 1, size);

            // Nếu có từ khóa tìm kiếm thì gọi phương thức searchProducts
            Page<Product> productPage = productService.searchProducts(keyword, pageable);

            return new ApiResponse<>(HttpStatus.OK.value(), "Get all products successfully", productPage);
        } catch (RuntimeException e) {
            return new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }
}
