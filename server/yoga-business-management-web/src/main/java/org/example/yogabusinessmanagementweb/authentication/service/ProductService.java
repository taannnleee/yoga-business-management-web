package org.example.yogabusinessmanagementweb.authentication.service;

import org.example.yogabusinessmanagementweb.common.entities.Product;

import java.util.List;

public interface ProductService {
    List<Product> getAllProduct();

    Product getProductById(String id);
}
