package org.example.yogabusinessmanagementweb.service.Impl;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.entities.*;
import org.example.yogabusinessmanagementweb.common.mapper.OrderCourseMapper;
import org.example.yogabusinessmanagementweb.common.util.JwtUtil;
import org.example.yogabusinessmanagementweb.dto.request.orderCourse.OrderCourseCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.coursecart.CourseCartResponse;
import org.example.yogabusinessmanagementweb.dto.response.orderCourse.OrderCourseResponse;
import org.example.yogabusinessmanagementweb.exception.AppException;
import org.example.yogabusinessmanagementweb.exception.ErrorCode;
import org.example.yogabusinessmanagementweb.repositories.CourseCartRepository;
import org.example.yogabusinessmanagementweb.repositories.CoursesRepository;
import org.example.yogabusinessmanagementweb.repositories.OrderCourseRepository;
import org.example.yogabusinessmanagementweb.service.CourseCartService;
import org.example.yogabusinessmanagementweb.service.OrderCourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class OrderCourseServiceImpl implements OrderCourseService {
    CoursesRepository coursesRepository;
    OrderCourseRepository orderCourseRepository;
    CourseCartRepository courseCartRepository;
    OrderCourseMapper orderCourseMapper;
    JwtUtil jwtUtil;

    @Override
    public List<OrderCourseResponse> showOrder(HttpServletRequest request) {
        User user = jwtUtil.getUserFromRequest(request);
        List<OrderCourse> orderCourses = orderCourseRepository.findAllByUser(user);

        if (orderCourses.isEmpty()) {
            return  List.of();
        }
        List<OrderCourseResponse> courseCartResponses = new ArrayList<>();
        for (OrderCourse course : orderCourses) {
            courseCartResponses.add(orderCourseMapper.toOrderCourseResponse (course));
        }

        return courseCartResponses;
    }

    @Transactional
    @Override
    public boolean createOrderCourse(OrderCourseCreationRequest orderCourseCreationRequest) {
        try {
            for (String temp : orderCourseCreationRequest.getCourseCartId()) {
                CourseCart a = courseCartRepository.findById(Long.valueOf(temp)).orElse(null);

                OrderCourse orderCourse = new OrderCourse();
                orderCourse.setCourse(a.getCourse());
                orderCourse.setUser(a.getUser());
                orderCourse.setTotalPrice(a.getTotalPrice());

                orderCourseRepository.save(orderCourse);
                courseCartRepository.delete(a);
            }
            return true;
        } catch (Exception e) {
            // 👇 Ghi log ra để dễ debug nếu có lỗi
//            log.error("Lỗi khi tạo đơn hàng: ", e);
            return false;
        }
    }

    @Override
    public boolean checkOrderCourse(String userId, String courseId) {
        Optional<OrderCourse> orderCourse = orderCourseRepository.findByUserIdAndCourseId( Long.parseLong(userId), Long.parseLong(courseId));
        if (orderCourse.isPresent()) {
            return true;
        }else {
            return false;
        }
    }

    @Override
    public int countAllOrderOfCourse(String courseId) {
        Optional<Courses> optionalCourse = coursesRepository.findById(Long.parseLong(courseId));

        if (optionalCourse.isPresent()) {
            Courses course = optionalCourse.get();
            List<OrderCourse> listOrderCourse = orderCourseRepository.findAllByCourse(course);
            return listOrderCourse.size();
        }

        return 0;
    }

}
