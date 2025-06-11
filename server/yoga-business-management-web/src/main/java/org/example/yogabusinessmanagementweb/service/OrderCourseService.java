package org.example.yogabusinessmanagementweb.service;

import jakarta.servlet.http.HttpServletRequest;
import org.example.yogabusinessmanagementweb.dto.request.orderCourse.OrderCourseCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.orderCourse.OrderCourseResponse;

import java.util.List;

public interface OrderCourseService {
    boolean createOrderCourse(OrderCourseCreationRequest orderCourseCreationRequest);
    List<OrderCourseResponse> showOrder(HttpServletRequest request);
    boolean checkOrderCourse(String userId, String courseId);

    int  countAllOrderOfCourse(String courseId);
}
