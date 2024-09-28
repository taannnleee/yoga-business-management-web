package org.example.yogabusinessmanagementweb.authentication.exception;

public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException(String id) {
        super("Sản phẩm với ID: " + id + " không tồn tại");
    }
}