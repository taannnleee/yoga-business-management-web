package org.example.yogabusinessmanagementweb.repositories;


import org.example.yogabusinessmanagementweb.common.entities.Product;
import org.example.yogabusinessmanagementweb.common.entities.SubCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findProductById(Long id);
    Page<Product> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);

    // Phương thức tìm sản phẩm theo subCategory
    Page<Product> findBySubCategory(SubCategory subCategory, Pageable pageable);
}
