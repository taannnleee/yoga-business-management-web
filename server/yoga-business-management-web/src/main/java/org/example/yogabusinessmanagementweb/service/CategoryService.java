package org.example.yogabusinessmanagementweb.service;

import org.example.yogabusinessmanagementweb.common.Enum.EStatus;
import org.example.yogabusinessmanagementweb.common.entities.Category;
import org.example.yogabusinessmanagementweb.dto.request.category.CategoryCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.category.CategoryResponse;

import java.util.List;

public interface CategoryService {
    CategoryResponse addCategory(CategoryCreationRequest categoryCreationRequest);
    Category findByIdAndStatus(Long id, EStatus status);

    List<CategoryResponse> getAllCategory();
}
