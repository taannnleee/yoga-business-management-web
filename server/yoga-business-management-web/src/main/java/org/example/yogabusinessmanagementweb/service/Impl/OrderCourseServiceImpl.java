package org.example.yogabusinessmanagementweb.service.Impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.entities.CourseCart;
import org.example.yogabusinessmanagementweb.common.entities.OrderCourse;
import org.example.yogabusinessmanagementweb.common.mapper.OrderCourseMapper;
import org.example.yogabusinessmanagementweb.dto.request.orderCourse.OrderCourseCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.orderCourse.OrderCourseResponse;
import org.example.yogabusinessmanagementweb.repositories.CourseCartRepository;
import org.example.yogabusinessmanagementweb.repositories.OrderCourseRepository;
import org.example.yogabusinessmanagementweb.service.CourseCartService;
import org.example.yogabusinessmanagementweb.service.OrderCourseService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class OrderCourseServiceImpl implements OrderCourseService {
    OrderCourseRepository orderCourseRepository;
    CourseCartRepository courseCartRepository;
    CourseCartService courseCartService;
    OrderCourseMapper orderCourseMapper;

    @Transactional
    @Override
    public boolean createOrderCourse(OrderCourseCreationRequest orderCourseCreationRequest) {
        try {
            for (String temp : orderCourseCreationRequest.getCourseCartId()) {
                CourseCart a = courseCartService.getCourseCartById(temp);

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

}
