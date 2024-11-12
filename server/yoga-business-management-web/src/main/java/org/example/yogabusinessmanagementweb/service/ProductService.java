package org.example.yogabusinessmanagementweb.service;

import org.example.yogabusinessmanagementweb.dto.request.product.ProductCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.product.AddProductResponse;
import org.example.yogabusinessmanagementweb.common.entities.Product;
import org.example.yogabusinessmanagementweb.dto.response.product.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {
    Page<Product>getAllProduct(Pageable pageable);

    Product getProductById(String id);
    ProductResponse getById(String id);
    Product addProduct(ProductCreationRequest productCreationRequest);

    boolean delete(String productId);
    Page<ProductResponse> searchProducts(String keyword, Pageable pageable);

    Page<ProductResponse> getAllProductBySubcategory(String id,String keyword, Pageable pageable);
}
