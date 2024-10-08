package org.example.yogabusinessmanagementweb.yoga.service;

import org.example.yogabusinessmanagementweb.common.entities.Category;
import org.example.yogabusinessmanagementweb.yoga.dto.request.category.CategoryCreationRequest;
import org.example.yogabusinessmanagementweb.yoga.dto.response.category.CategoryResponse;

public interface CategoryService {
    CategoryResponse addCategory(CategoryCreationRequest categoryCreationRequest);
    Category findByIdAndStatus(Long id, String status);
}
