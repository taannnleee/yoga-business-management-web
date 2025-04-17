package org.example.yogabusinessmanagementweb.repositories;

import org.example.yogabusinessmanagementweb.common.entities.CourseCart;
import org.example.yogabusinessmanagementweb.common.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseCartRepository extends JpaRepository<CourseCart, Long> {
    List<CourseCart> findAllByUser(User user);
}
