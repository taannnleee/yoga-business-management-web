package org.example.yogabusinessmanagementweb.authentication.controller;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.authentication.dto.request.AddProductRequest;
import org.example.yogabusinessmanagementweb.authentication.dto.response.AddProductResponse;
import org.example.yogabusinessmanagementweb.authentication.dto.response.ResponseData;
import org.example.yogabusinessmanagementweb.authentication.repositories.UserRepository;
import org.example.yogabusinessmanagementweb.authentication.service.Impl.AuthencationService;
import org.example.yogabusinessmanagementweb.authentication.service.ProductService;
import org.example.yogabusinessmanagementweb.authentication.service.UserService;
import org.example.yogabusinessmanagementweb.sendEmail.service.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api")
@Slf4j
public class CategoryControler {
    UserService userService;
    UserRepository userRepository;
    EmailService emailService;
    AuthencationService authencationService;
    ProductService productService;

    @PostMapping("/add-product")
    public ResponseData<?> creatProduct(@RequestBody AddProductRequest addProductRequest) {
        AddProductResponse addProductResponse = productService.addProduct(addProductRequest);
        return new ResponseData<>(HttpStatus.OK.value(), "create product  successfully",addProductResponse);
    }


    // hàm xóa thẳng bản ghi(thường ít ai dùng)
    @PostMapping("/delete-product/{productId}")
    public ResponseData<?> deleteProduct(@PathVariable String productId) {
        try{
            productService.delete(productId);
            return new ResponseData<>(HttpStatus.OK.value(), "delete product  successfully");
        }catch (Exception e){
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(),e.getMessage());
        }
    }
}
