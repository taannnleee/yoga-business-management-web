package org.example.yogabusinessmanagementweb.repositories;

import org.example.yogabusinessmanagementweb.common.entities.Wishlist;
import org.example.yogabusinessmanagementweb.common.entities.WishlistCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WishlistCourseRepository extends JpaRepository<WishlistCourse, Long> {
}
