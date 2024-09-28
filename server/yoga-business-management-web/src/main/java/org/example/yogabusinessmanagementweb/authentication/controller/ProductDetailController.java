package org.example.yogabusinessmanagementweb.authentication.controller;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.authentication.dto.response.ResponseData;
import org.example.yogabusinessmanagementweb.authentication.exception.ProductNotFoundException;
import org.example.yogabusinessmanagementweb.authentication.exception.UserNotFoundException;
import org.example.yogabusinessmanagementweb.authentication.repositories.UserRepository;
import org.example.yogabusinessmanagementweb.authentication.service.Impl.AuthencationService;
import org.example.yogabusinessmanagementweb.authentication.service.ProductService;
import org.example.yogabusinessmanagementweb.authentication.service.UserService;
import org.example.yogabusinessmanagementweb.common.entities.Product;
import org.example.yogabusinessmanagementweb.sendEmail.service.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/product-detail")
@Slf4j
public class ProductDetailController {
    UserService userService;
    UserRepository userRepository;
    EmailService emailService;
    AuthencationService authencationService;
    ProductService productService;

    @GetMapping("/getProduct/{id}")
    public ResponseData<?> getProductDetail(@PathVariable String id){
        Product product = productService.getProductById(id);
        return new ResponseData<>(HttpStatus.OK.value(), "get product detail successfully",product);
    }
}
