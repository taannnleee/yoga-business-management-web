package org.example.yogabusinessmanagementweb.common.mapper;

import jakarta.persistence.ManyToOne;
import org.example.yogabusinessmanagementweb.common.entities.SubCategory;
import org.example.yogabusinessmanagementweb.dto.request.subcategory.SubCategoryCreationRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SubCategoryMapper {

//    @Mapping(source = "classname", target = "firstname"): dung de map 2 doi tuong k cung ten
//    @Mapping(source = "classname", ignore = true): dùng để loại bỏ 1 đối tượng. k cho nó map
    SubCategory toSubCategory(SubCategoryCreationRequest subCategoryCreationRequest);
}
