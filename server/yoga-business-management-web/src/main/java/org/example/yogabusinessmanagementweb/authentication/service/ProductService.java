package org.example.yogabusinessmanagementweb.authentication.service;

import org.example.yogabusinessmanagementweb.authentication.dto.request.AddProductRequest;
import org.example.yogabusinessmanagementweb.common.entities.Product;

import java.util.List;

public interface ProductService {
    List<Product> getAllProduct();

    Product getProductById(String id);

    boolean addProduct(AddProductRequest addProductRequest);

    boolean delete(String productId);
}
