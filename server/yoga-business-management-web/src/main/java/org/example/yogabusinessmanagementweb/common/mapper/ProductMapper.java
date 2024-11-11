package org.example.yogabusinessmanagementweb.common.mapper;

import org.example.yogabusinessmanagementweb.common.entities.Product;
import org.example.yogabusinessmanagementweb.dto.request.product.ProductCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.product.ProductResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    // Ignore the variantList field in the Product entity when mapping
    Product toProduct(ProductCreationRequest productDTO);
    ProductResponse productToProductResponse(Product product);

    List<ProductResponse> productsToProductResponses(List<Product> products);
}
