package org.example.yogabusinessmanagementweb.dto.response.coursecart;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.entities.Courses;
import org.example.yogabusinessmanagementweb.common.entities.User;

import java.math.BigDecimal;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class CourseCartResponse {
    Long id;
    Long idCourse;
    BigDecimal totalPrice;

    String imagePath;
    String name;

}
