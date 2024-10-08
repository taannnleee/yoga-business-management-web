package org.example.yogabusinessmanagementweb.yoga.service;

import org.example.yogabusinessmanagementweb.yoga.dto.request.product.AddProductRequest;
import org.example.yogabusinessmanagementweb.yoga.dto.response.product.AddProductResponse;
import org.example.yogabusinessmanagementweb.common.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {
    Page<Product>getAllProduct(Pageable pageable);

    Product getProductById(String id);

    AddProductResponse addProduct(AddProductRequest addProductRequest);

    boolean delete(String productId);
    Page<Product> searchProducts(String keyword, Pageable pageable);
}
