package org.example.yogabusinessmanagementweb.common.mapper;

import javax.annotation.processing.Generated;
import org.example.yogabusinessmanagementweb.common.entities.SubCategory;
import org.example.yogabusinessmanagementweb.dto.request.subcategory.SubCategoryCreationRequest;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-11-04T11:30:36+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.5 (Oracle Corporation)"
)
@Component
public class SubCategoryMapperImpl implements SubCategoryMapper {

    @Override
    public SubCategory toSubCategory(SubCategoryCreationRequest subCategoryCreationRequest) {
        if ( subCategoryCreationRequest == null ) {
            return null;
        }

        SubCategory.SubCategoryBuilder subCategory = SubCategory.builder();

        subCategory.name( subCategoryCreationRequest.getName() );

        return subCategory.build();
    }
}
