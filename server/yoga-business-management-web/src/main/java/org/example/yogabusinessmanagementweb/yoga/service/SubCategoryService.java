package org.example.yogabusinessmanagementweb.yoga.service;

import org.example.yogabusinessmanagementweb.yoga.dto.request.subcategory.SubCategoryCreationRequest;
import org.example.yogabusinessmanagementweb.yoga.dto.response.subcategory.SubCategoryResponse;

public interface SubCategoryService {
    SubCategoryResponse addSubCategory(SubCategoryCreationRequest subCategoryCreationRequest);
}
