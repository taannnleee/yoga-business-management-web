package org.example.yogabusinessmanagementweb.common.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Entity
@Table(name = "CourseCart")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class CourseCart extends AbstractEntity<Long>{
    BigDecimal totalPrice;

    @ManyToOne()
    @JoinColumn(name = "course_id")
    Courses course;

    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;
}
