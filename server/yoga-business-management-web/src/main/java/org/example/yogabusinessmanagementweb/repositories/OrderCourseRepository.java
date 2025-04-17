package org.example.yogabusinessmanagementweb.repositories;

import org.example.yogabusinessmanagementweb.common.entities.CourseCart;
import org.example.yogabusinessmanagementweb.common.entities.OrderCourse;
import org.example.yogabusinessmanagementweb.common.entities.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderCourseRepository extends CrudRepository<OrderCourse, Long> {
    List<OrderCourse> findAllByUser(User user);
}
