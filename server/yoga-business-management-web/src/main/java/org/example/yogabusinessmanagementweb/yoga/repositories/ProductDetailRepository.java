package org.example.yogabusinessmanagementweb.yoga.repositories;

import org.example.yogabusinessmanagementweb.common.entities.Product;
import org.example.yogabusinessmanagementweb.common.entities.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductDetailRepository extends JpaRepository<ProductDetail, Long> {
    Optional<ProductDetail> findProductDetailById(Long id);
    Optional<ProductDetail> findProductDetailByProduct(Product product);
}
