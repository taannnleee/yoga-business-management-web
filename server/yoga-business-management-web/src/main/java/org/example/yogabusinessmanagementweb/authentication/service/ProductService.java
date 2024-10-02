package org.example.yogabusinessmanagementweb.authentication.service;

import org.example.yogabusinessmanagementweb.authentication.dto.request.AddProductRequest;
import org.example.yogabusinessmanagementweb.authentication.dto.request.cart.CartCreationRequest;
import org.example.yogabusinessmanagementweb.authentication.dto.response.AddProductResponse;
import org.example.yogabusinessmanagementweb.authentication.dto.response.AddYogaWorkoutRequest;
import org.example.yogabusinessmanagementweb.authentication.dto.response.cart.CartResponse;
import org.example.yogabusinessmanagementweb.common.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {
    Page<Product>getAllProduct(Pageable pageable);

    Product getProductById(String id);

    AddProductResponse addProduct(AddProductRequest addProductRequest);

    boolean delete(String productId);
    Page<Product> searchProducts(String keyword, Pageable pageable);
}
