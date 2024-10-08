package org.example.yogabusinessmanagementweb.yoga.repositories;

import org.example.yogabusinessmanagementweb.common.entities.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubCategoryRepository extends JpaRepository<SubCategory, Long> {
    Optional<SubCategory> findById(Long id);
}