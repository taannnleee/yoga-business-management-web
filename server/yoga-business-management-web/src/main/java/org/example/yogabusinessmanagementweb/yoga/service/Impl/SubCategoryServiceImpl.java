package org.example.yogabusinessmanagementweb.yoga.service.Impl;

import org.example.yogabusinessmanagementweb.common.entities.SubCategory;
import org.example.yogabusinessmanagementweb.common.mapper.Mappers;
import org.example.yogabusinessmanagementweb.yoga.dto.request.subcategory.SubCategoryCreationRequest;
import org.example.yogabusinessmanagementweb.yoga.dto.response.subcategory.SubCategoryResponse;
import org.example.yogabusinessmanagementweb.yoga.repositories.SubCategoryRepository;
import org.example.yogabusinessmanagementweb.yoga.service.CategoryService;
import org.example.yogabusinessmanagementweb.yoga.service.SubCategoryService;
import org.springframework.stereotype.Service;

@Service
public class SubCategoryServiceImpl implements SubCategoryService {
    SubCategoryRepository subCategoryRepository;
    CategoryService categoryService;

    @Override
    public SubCategoryResponse addSubCategory(SubCategoryCreationRequest subCategoryCreationRequest) {
        categoryService.findByIdAndStatus(subCategoryCreationRequest.getCategoryId(),"active");



        // Chuyển đổi từ DTO sang Entity
        SubCategory subCategory  = Mappers.convertToEntity(subCategoryCreationRequest, SubCategory.class);
        return null;
    }
}
