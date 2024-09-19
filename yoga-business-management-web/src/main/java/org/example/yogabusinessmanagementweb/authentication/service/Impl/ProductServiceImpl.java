package org.example.yogabusinessmanagementweb.authentication.service.Impl;

import org.example.yogabusinessmanagementweb.authentication.repositories.ProductRepository;
import org.example.yogabusinessmanagementweb.authentication.service.ProductService;
import org.example.yogabusinessmanagementweb.common.entities.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductRepository productRepository;
    @Override
    public List<Product> getAllProduct() {
        return productRepository.findAll();
    }

    @Override
    public Product getProductById(String id) {
        Optional<Product>  productOptional =  productRepository.findProductById(Long.valueOf(id));
        if(productOptional.isPresent()){
            return productOptional.get();
        }
        return null;
    }
}
