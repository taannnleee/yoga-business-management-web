package org.example.yogabusinessmanagementweb.authentication.service;

import org.example.yogabusinessmanagementweb.authentication.dto.request.AddProductRequest;
import org.example.yogabusinessmanagementweb.common.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {
    Page<Product>getAllProduct(Pageable pageable);

    Product getProductById(String id);

    boolean addProduct(AddProductRequest addProductRequest);

    boolean delete(String productId);
}
