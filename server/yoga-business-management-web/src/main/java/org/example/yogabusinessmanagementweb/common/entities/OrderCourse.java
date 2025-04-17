package org.example.yogabusinessmanagementweb.common.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.Enum.EStatusOrder;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "OrderCourse")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderCourse extends AbstractEntity<Long> implements Serializable {
    BigDecimal totalPrice;

    @ManyToOne()
    @JoinColumn(name = "course_id")
    Courses course;

    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;
}
