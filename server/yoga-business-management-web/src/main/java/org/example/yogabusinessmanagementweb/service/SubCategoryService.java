package org.example.yogabusinessmanagementweb.service;

import org.example.yogabusinessmanagementweb.dto.request.subcategory.SubCategoryCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.subcategory.SubCategoryResponse;

public interface SubCategoryService {
    SubCategoryResponse addSubCategory(SubCategoryCreationRequest subCategoryCreationRequest);
}
