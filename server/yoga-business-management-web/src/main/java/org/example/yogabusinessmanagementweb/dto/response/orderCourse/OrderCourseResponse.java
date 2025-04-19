package org.example.yogabusinessmanagementweb.dto.response.orderCourse;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class OrderCourseResponse {
    Long id;
    Long idCourse;
    BigDecimal totalPrice;

    String imagePath;
    String name;

}
