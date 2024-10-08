package org.example.yogabusinessmanagementweb.yoga.controller.admin;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.yoga.dto.request.product.AddProductRequest;
import org.example.yogabusinessmanagementweb.yoga.dto.response.product.AddProductResponse;
import org.example.yogabusinessmanagementweb.yoga.dto.response.ApiResponse;
import org.example.yogabusinessmanagementweb.yoga.repositories.UserRepository;
import org.example.yogabusinessmanagementweb.yoga.service.Impl.AuthencationService;
import org.example.yogabusinessmanagementweb.yoga.service.ProductService;
import org.example.yogabusinessmanagementweb.yoga.service.UserService;
import org.example.yogabusinessmanagementweb.sendEmail.service.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/admin")
@Slf4j
public class AdminProductController {
    UserService userService;
    UserRepository userRepository;
    EmailService emailService;
    AuthencationService authencationService;
    ProductService productService;

    @PostMapping("/add-product")
    public ApiResponse<?> creatProduct(@RequestBody AddProductRequest addProductRequest) {
        AddProductResponse addProductResponse = productService.addProduct(addProductRequest);
        return new ApiResponse<>(HttpStatus.OK.value(), "create product  successfully",addProductResponse);
    }


    // hàm xóa thẳng bản ghi(thường ít ai dùng)
    @PostMapping("/delete-product/{productId}")
    public ApiResponse<?> deleteProduct(@PathVariable String productId) {
        try{
            productService.delete(productId);
            return new ApiResponse<>(HttpStatus.OK.value(), "delete product  successfully");
        }catch (Exception e){
            return new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(),e.getMessage());
        }
    }
}
