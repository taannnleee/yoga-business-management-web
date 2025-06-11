package org.example.yogabusinessmanagementweb.controller.user.orderCourse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.common.entities.Order;
import org.example.yogabusinessmanagementweb.common.entities.User;
import org.example.yogabusinessmanagementweb.common.util.JwtUtil;
import org.example.yogabusinessmanagementweb.dto.request.course.CartCourseDeleteRequest;
import org.example.yogabusinessmanagementweb.dto.request.order.OrderCreationRequest;
import org.example.yogabusinessmanagementweb.dto.request.orderCourse.OrderCourseCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.ApiResponse;
import org.example.yogabusinessmanagementweb.dto.response.ListDto;
import org.example.yogabusinessmanagementweb.dto.response.cart.CartResponse;
import org.example.yogabusinessmanagementweb.dto.response.coursecart.CourseCartResponse;
import org.example.yogabusinessmanagementweb.dto.response.order.OrderCommentResponse;
import org.example.yogabusinessmanagementweb.dto.response.order.OrderResponse;
import org.example.yogabusinessmanagementweb.dto.response.orderCourse.OrderCourseResponse;
import org.example.yogabusinessmanagementweb.dto.response.product.ProductResponse;
import org.example.yogabusinessmanagementweb.repositories.UserRepository;
import org.example.yogabusinessmanagementweb.service.*;
import org.example.yogabusinessmanagementweb.service.Impl.AuthencationService;
import org.example.yogabusinessmanagementweb.service.Impl.WebSocketService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/order-course")
@Slf4j
public class OrderCourseController {

    OrderCourseService orderCourseService;
    MembershipService membershipService;

    @PostMapping("/create")
    public ApiResponse<?> createOrderCourse(HttpServletRequest request,@RequestBody OrderCourseCreationRequest orderCourseCreationRequest) {
        orderCourseService.createOrderCourse(orderCourseCreationRequest);
        membershipService.updateMembershipTypeByTotal(request);
        return new ApiResponse<>(HttpStatus.OK.value(), "create course order success");
    }

    @GetMapping("/show-order")
    public ApiResponse<?> showOrder(HttpServletRequest request) {
        List<OrderCourseResponse> orderCourseResponses = orderCourseService.showOrder(request);
        return new ApiResponse<>(HttpStatus.OK.value(), "show order success",orderCourseResponses);
    }

    @GetMapping("/count-order-of-course/{courseId}")
    public ApiResponse<?> countAllOrderOfCourse(@PathVariable String courseId) {
        int countOrder = orderCourseService.countAllOrderOfCourse(courseId);
        return new ApiResponse<>(HttpStatus.OK.value(), "get order course response success",countOrder);
    }

}
