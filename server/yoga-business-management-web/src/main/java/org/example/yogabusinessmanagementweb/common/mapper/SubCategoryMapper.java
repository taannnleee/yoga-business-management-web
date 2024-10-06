package org.example.yogabusinessmanagementweb.common.mapper;

import org.example.yogabusinessmanagementweb.authentication.dto.response.category.CategoryResponse;
import org.example.yogabusinessmanagementweb.common.entities.Category;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CategoryMapper {
    CategoryResponse categoryToCategoryResponse(Category category);


    List<CategoryResponse> categoriesToCategoryResponses(List<Category> categories);
}
