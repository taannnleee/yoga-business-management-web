package org.example.yogabusinessmanagementweb.yoga.service.Impl;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.Enum.EStatus;
import org.example.yogabusinessmanagementweb.common.entities.Category;
import org.example.yogabusinessmanagementweb.common.mapper.Mappers;
import org.example.yogabusinessmanagementweb.yoga.dto.request.category.CategoryCreationRequest;
import org.example.yogabusinessmanagementweb.yoga.dto.response.category.CategoryResponse;
import org.example.yogabusinessmanagementweb.yoga.dto.response.user.RegistrationResponse;
import org.example.yogabusinessmanagementweb.yoga.exception.AppException;
import org.example.yogabusinessmanagementweb.yoga.exception.ErrorCode;
import org.example.yogabusinessmanagementweb.yoga.repositories.CategoryRepository;
import org.example.yogabusinessmanagementweb.yoga.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@Service
public class CategoryServiceImpl implements CategoryService {

    CategoryRepository categoryRepository;

    @Override
    public CategoryResponse addCategory(CategoryCreationRequest categoryCreationRequest) {
        Category category = Mappers.convertToEntity(categoryCreationRequest, Category.class);

        // Gán giá trị mặc định cho status nếu nó là null
        if (category.getStatus() == null) {
            category.setStatus(EStatus.ACTIVE);
        }
        // Kiểm tra nếu tên đã tồn tại và status là true
        Optional<Category> existingCategory = categoryRepository.findByNameAndStatus(category.getName(), category.getStatus());

        if (existingCategory.isPresent()) {
            throw new AppException(ErrorCode.CATEGORY_EXISTS);
        }

        category = categoryRepository.save(category);

        CategoryResponse categoryResponse = Mappers.convertToDto(category, CategoryResponse.class);
        return categoryResponse;
    }

    @Override
    public Category findByIdAndStatus(Long id, EStatus status) {
        // Tìm kiếm danh mục theo tên và trạng thái
        return categoryRepository.findByIdAndStatus(id, status)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
    }
}

