package org.example.yogabusinessmanagementweb.yoga.controller.admin.category;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.yoga.dto.request.category.CategoryCreationRequest;
import org.example.yogabusinessmanagementweb.yoga.dto.request.product.AddProductRequest;
import org.example.yogabusinessmanagementweb.yoga.dto.response.category.CategoryResponse;
import org.example.yogabusinessmanagementweb.yoga.dto.response.product.AddProductResponse;
import org.example.yogabusinessmanagementweb.yoga.dto.response.ApiResponse;
import org.example.yogabusinessmanagementweb.yoga.repositories.UserRepository;
import org.example.yogabusinessmanagementweb.yoga.service.CategoryService;
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
public class AdminCategoryController {
    CategoryService categoryService;

    @PostMapping("/add-category")
    public ApiResponse<?> createCategory(@RequestBody CategoryCreationRequest categoryCreationRequest) {
        CategoryResponse addCategoryResponse = categoryService.addCategory(categoryCreationRequest);
        return new ApiResponse<>(HttpStatus.OK.value(), "create category  successfully",addCategoryResponse);
    }
}
