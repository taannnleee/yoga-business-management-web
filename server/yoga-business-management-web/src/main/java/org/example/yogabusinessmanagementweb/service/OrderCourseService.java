package org.example.yogabusinessmanagementweb.service;

import org.example.yogabusinessmanagementweb.dto.request.orderCourse.OrderCourseCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.orderCourse.OrderCourseResponse;

public interface OrderCourseService {
    boolean createOrderCourse(OrderCourseCreationRequest orderCourseCreationRequest);
}
