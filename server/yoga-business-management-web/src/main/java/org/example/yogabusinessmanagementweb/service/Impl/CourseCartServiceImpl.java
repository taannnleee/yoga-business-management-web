package org.example.yogabusinessmanagementweb.service.Impl;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.entities.Address;
import org.example.yogabusinessmanagementweb.common.entities.Cart;
import org.example.yogabusinessmanagementweb.common.entities.CourseCart;
import org.example.yogabusinessmanagementweb.common.entities.User;
import org.example.yogabusinessmanagementweb.common.mapper.CourseCartMapper;
import org.example.yogabusinessmanagementweb.common.mapper.Mappers;
import org.example.yogabusinessmanagementweb.common.util.JwtUtil;
import org.example.yogabusinessmanagementweb.dto.request.cart.CartCreationRequest;
import org.example.yogabusinessmanagementweb.dto.request.cart.CartDeleteRequest;
import org.example.yogabusinessmanagementweb.dto.request.cart.CartItemCreationRequest;
import org.example.yogabusinessmanagementweb.dto.request.course.CartCourseDeleteRequest;
import org.example.yogabusinessmanagementweb.dto.request.coursecart.AddToCartRequest;
import org.example.yogabusinessmanagementweb.dto.request.coursecart.CartCourseCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.cart.CartItemResponse;
import org.example.yogabusinessmanagementweb.dto.response.cart.CartResponse;
import org.example.yogabusinessmanagementweb.dto.response.coursecart.CourseCartResponse;
import org.example.yogabusinessmanagementweb.exception.AppException;
import org.example.yogabusinessmanagementweb.exception.ErrorCode;
import org.example.yogabusinessmanagementweb.repositories.CartRepository;
import org.example.yogabusinessmanagementweb.repositories.CourseCartRepository;
import org.example.yogabusinessmanagementweb.service.CourseCartService;
import org.example.yogabusinessmanagementweb.service.CoursesService;
import org.example.yogabusinessmanagementweb.service.JwtService;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.io.Console;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@Service
public class CourseCartServiceImpl implements CourseCartService {

    CourseCartRepository courseCartRepository;
    JwtUtil jwtUtil;
    CoursesService coursesService;
    CourseCartMapper courseCartMapper;

    @Override
    public CourseCart getCourseCartById(String id) {
        return courseCartRepository.findById(Long.valueOf(id)).orElseThrow(()-> new AppException(ErrorCode.COURSE_CART_NOT_FOUND));
    }

    @Override
    public List<CourseCartResponse> showCart(HttpServletRequest request) {
        User user = jwtUtil.getUserFromRequest(request);
        List<CourseCart> cartOptional = courseCartRepository.findAllByUser(user);

        if (cartOptional.isEmpty()) {
            return  List.of();
        }
        List<CourseCartResponse> courseCartResponses = new ArrayList<>();
        for (CourseCart cart : cartOptional) {
            courseCartResponses.add(courseCartMapper.courseCartToCourseCartResponse(cart));
        }

        return courseCartResponses;
    }

    @Override
    public CourseCartResponse removeFromCart(HttpServletRequest request, CartCourseDeleteRequest cartCourseDeleteRequest) {
        User user = jwtUtil.getUserFromRequest(request);

        CourseCart courseCart = getCourseCartById(cartCourseDeleteRequest.getCourseId());
        courseCartRepository.delete(courseCart);

        courseCartMapper.courseCartToCourseCartResponse(courseCart);
        return courseCartMapper.courseCartToCourseCartResponse(courseCart);
    }

    //tham số đầu tiên là danh sách khóa học trong courseCart, tham số thứ 2 là String id để check
    @Override
    public boolean checkCourseExist(List<CourseCart> courseCartResponse, String idCourse){
        for(CourseCart courseCart : courseCartResponse) {

            String StringProduct =  String.valueOf(courseCart.getCourse().getId());
            if(StringProduct.equals(idCourse)){
                return true;
            }
        }
        return false;
    }


    @Override
    public CourseCartResponse addToCart(AddToCartRequest addToCartRequest, HttpServletRequest request) {
        User user = jwtUtil.getUserFromRequest(request);
        List<CourseCart> courseCartResponse = courseCartRepository.findAllByUser(user);
        boolean existingCourse = checkCourseExist(courseCartResponse, addToCartRequest.getCourseId());

        if (existingCourse == true) {
            throw new AppException(ErrorCode.PURCHASES_COURSE);
        } else {
            // Nếu sản phẩm chưa tồn tại => tạo CartItem mới
            CourseCart newItem = new CourseCart();
            newItem.setCourse(coursesService.getCourseByid(addToCartRequest.getCourseId())); // Tìm sản phẩm
            newItem.setTotalPrice(newItem.getCourse().getPrice());

            newItem.setUser(user);
            // Thêm CartItem vào cart
            courseCartRepository.save(newItem);
            return courseCartMapper.courseCartToCourseCartResponse(newItem);
        }

    }
}
