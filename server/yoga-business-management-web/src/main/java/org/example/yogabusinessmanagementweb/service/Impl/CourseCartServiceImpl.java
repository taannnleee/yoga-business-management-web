package org.example.yogabusinessmanagementweb.service.Impl;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.entities.Cart;
import org.example.yogabusinessmanagementweb.common.entities.CourseCart;
import org.example.yogabusinessmanagementweb.common.entities.User;
import org.example.yogabusinessmanagementweb.common.mapper.Mappers;
import org.example.yogabusinessmanagementweb.common.util.JwtUtil;
import org.example.yogabusinessmanagementweb.dto.request.cart.CartCreationRequest;
import org.example.yogabusinessmanagementweb.dto.request.cart.CartItemCreationRequest;
import org.example.yogabusinessmanagementweb.dto.request.coursecart.CartCourseCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.cart.CartItemResponse;
import org.example.yogabusinessmanagementweb.dto.response.cart.CartResponse;
import org.example.yogabusinessmanagementweb.exception.AppException;
import org.example.yogabusinessmanagementweb.exception.ErrorCode;
import org.example.yogabusinessmanagementweb.repositories.CartRepository;
import org.example.yogabusinessmanagementweb.repositories.CourseCartRepository;
import org.example.yogabusinessmanagementweb.service.CourseCartService;
import org.example.yogabusinessmanagementweb.service.CoursesService;
import org.example.yogabusinessmanagementweb.service.JwtService;
import org.springframework.stereotype.Service;

import java.io.Console;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@Service
public class CourseCartServiceImpl implements CourseCartService {

    CourseCartRepository courseCartRepository;
    JwtUtil jwtUtil;
    CoursesService coursesService;

    @Override
    public List<CourseCart> showCart(HttpServletRequest request) {
        User user = jwtUtil.getUserFromRequest(request);
        List<CourseCart> cartOptional = courseCartRepository.findAllByUser(user);

        if (cartOptional.isEmpty()) {
            throw new AppException(ErrorCode.CART_ITEM_EMPTY);
        }

//        CourseCart courseCart = cartOptional.get();
//        return courseCart;
        return cartOptional;
    }


    @Override
    public CourseCart addToCart(CartCreationRequest cartCreationRequest, HttpServletRequest request) {
        User user = jwtUtil.getUserFromRequest(request);
        List<CourseCart> courseCartResponse = courseCartRepository.findAllByUser(user);
        CourseCart existingCourse = null;
        for(CourseCart courseCart : courseCartResponse) {

            String StringProduct =  String.valueOf(courseCart.getCourse().getId());
            if(StringProduct.equals(cartCreationRequest.getProductId())){
                existingCourse = courseCart;
                break;
            }
        }
        if (existingCourse != null) {
            // Nếu sản phẩm đã tồn tại tăng số lượng
            existingCourse.setQuantity(existingCourse.getQuantity() + cartCreationRequest.getQuantity());

            BigDecimal price = existingCourse.getCourse().getPrice(); // Giá sản phẩm
            int quantity = existingCourse.getQuantity();

            BigDecimal totalPrice = price.multiply(BigDecimal.valueOf(quantity));
            existingCourse.setTotalPrice(totalPrice);
            courseCartRepository.save(existingCourse);
            return existingCourse;
        } else {
            // Nếu sản phẩm chưa tồn tại hoặc variants khác nhau, tạo CartItem mới
            CourseCart newItem = new CourseCart();
            newItem.setCourse(coursesService.getCourseByid(cartCreationRequest.getProductId())); // Tìm sản phẩm
            newItem.setQuantity(cartCreationRequest.getQuantity());
            newItem.setTotalPrice(newItem.getCourse().getPrice().multiply(BigDecimal.valueOf(newItem.getQuantity())));

            newItem.setUser(user);
            // Thêm CartItem vào cart
            courseCartRepository.save(newItem);
            return newItem;
        }

    }
    @Override
    public CartItemResponse increaseToCart(CartCourseCreationRequest cartCourseCreationRequest, HttpServletRequest request) {
//        CourseCart courseCart

        return  new CartItemResponse();

    }
}
