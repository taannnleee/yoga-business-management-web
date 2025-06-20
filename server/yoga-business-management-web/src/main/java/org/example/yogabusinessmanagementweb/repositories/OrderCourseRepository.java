package org.example.yogabusinessmanagementweb.repositories;

import org.example.yogabusinessmanagementweb.common.entities.Courses;
import org.example.yogabusinessmanagementweb.common.entities.OrderCourse;
import org.example.yogabusinessmanagementweb.common.entities.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderCourseRepository extends CrudRepository<OrderCourse, Long> {
    List<OrderCourse> findAllByUser(User user);
    Optional<OrderCourse> findByUserIdAndCourseId(Long userId, Long courseId);
    List<OrderCourse> findAllByCourse(Courses courses);
}
