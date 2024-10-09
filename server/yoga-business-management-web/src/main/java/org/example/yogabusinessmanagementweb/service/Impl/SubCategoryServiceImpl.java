package org.example.yogabusinessmanagementweb.service.Impl;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.Enum.EStatus;
import org.example.yogabusinessmanagementweb.common.entities.Category;
import org.example.yogabusinessmanagementweb.common.entities.SubCategory;
import org.example.yogabusinessmanagementweb.common.mapper.Mappers;
import org.example.yogabusinessmanagementweb.common.mapper.SubCategoryMapper;
import org.example.yogabusinessmanagementweb.dto.request.subcategory.SubCategoryCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.subcategory.SubCategoryResponse;
import org.example.yogabusinessmanagementweb.repositories.SubCategoryRepository;
import org.example.yogabusinessmanagementweb.service.CategoryService;
import org.example.yogabusinessmanagementweb.service.SubCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@Service
public class SubCategoryServiceImpl implements SubCategoryService {
    SubCategoryRepository subCategoryRepository;
    CategoryService categoryService;

    @Autowired
    private SubCategoryMapper subCategoryMapper;

    @Override
    public SubCategoryResponse addSubCategory(SubCategoryCreationRequest subCategoryCreationRequest) {


        Category category = categoryService.findByIdAndStatus(Long.valueOf(subCategoryCreationRequest.getCategoryId()),EStatus.ACTIVE);

        // Chuyển đổi từ DTO sang Entity
        SubCategory subCategory = subCategoryMapper.toSubCategory(subCategoryCreationRequest);
        if (subCategory.getStatus() == null) {
            subCategory.setStatus(EStatus.ACTIVE);
        }
        subCategory.setCategory(category);
        subCategoryRepository.save(subCategory);

        // Chuyển đổi từ Entity sang DTO
        return Mappers.convertToDto(subCategory,SubCategoryResponse.class);
    }
}
