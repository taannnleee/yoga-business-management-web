package org.example.yogabusinessmanagementweb.yoga.controller.admin.subcategory;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.yoga.dto.request.category.CategoryCreationRequest;
import org.example.yogabusinessmanagementweb.yoga.dto.request.subcategory.SubCategoryCreationRequest;
import org.example.yogabusinessmanagementweb.yoga.dto.response.ApiResponse;
import org.example.yogabusinessmanagementweb.yoga.dto.response.subcategory.SubCategoryResponse;
import org.example.yogabusinessmanagementweb.yoga.service.CategoryService;
import org.example.yogabusinessmanagementweb.yoga.service.SubCategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/admin")
@Slf4j
public class AdminSubcategoryController {
    SubCategoryService subCategoryService;

    @PostMapping("/add-subcategory")
    public ApiResponse<?> createSubCategory(@RequestBody SubCategoryCreationRequest subCategoryCreationRequest) {
        SubCategoryResponse subcategoryResponse = subCategoryService.addSubCategory(subCategoryCreationRequest);
        return new ApiResponse<>(HttpStatus.OK.value(), "create subcategory  successfully",subcategoryResponse);
    }
}
