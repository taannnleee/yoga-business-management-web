package org.example.yogabusinessmanagementweb.common.mapper;

import org.example.yogabusinessmanagementweb.common.entities.Product;
import org.example.yogabusinessmanagementweb.dto.request.product.ProductCreationRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    // Ignore the variantList field in the Product entity when mapping
    @Mapping(target = "variantList", ignore = true)
    Product toProduct(ProductCreationRequest productCreationRequest);
}
