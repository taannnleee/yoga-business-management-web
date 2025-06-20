package org.example.yogabusinessmanagementweb.service.Impl;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.apache.poi.hpsf.Decimal;
import org.example.yogabusinessmanagementweb.common.entities.MembershipType;
import org.example.yogabusinessmanagementweb.common.entities.User;
import org.example.yogabusinessmanagementweb.common.util.JwtUtil;
import org.example.yogabusinessmanagementweb.controller.user.membership.MembershipController;
import org.example.yogabusinessmanagementweb.dto.response.ApiResponse;
import org.example.yogabusinessmanagementweb.dto.response.order.OrderResponse;
import org.example.yogabusinessmanagementweb.dto.response.orderCourse.OrderCourseResponse;
import org.example.yogabusinessmanagementweb.repositories.MembershipTypeRepository;
import org.example.yogabusinessmanagementweb.repositories.UserRepository;
import org.example.yogabusinessmanagementweb.service.MembershipService;
import org.example.yogabusinessmanagementweb.service.OrderCourseService;
import org.example.yogabusinessmanagementweb.service.OrderService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class MembershipServiceImpl implements MembershipService {
    JwtUtil jwtUtil;
    OrderCourseService orderCourseService;
    OrderService orderService;
    MembershipTypeRepository membershipTypeRepository;
    UserRepository userRepository;
    @Override
    public MembershipType getMembershipType(HttpServletRequest request) {
        User user = jwtUtil.getUserFromRequest(request);
        return user.getMembershipType();
    }

    @Override
    public BigDecimal totalAmount(HttpServletRequest request) {
        BigDecimal totalAmount = BigDecimal.ZERO;
        User user = jwtUtil.getUserFromRequest(request);
        List<OrderCourseResponse> listOrder =  orderCourseService.showOrder(request);
        for(OrderCourseResponse orderCourseResponse : listOrder) {
            totalAmount = totalAmount.add(orderCourseResponse.getTotalPrice());

        }

        List<OrderResponse> listOr = orderService.showOrderOfUser(request);
        for(OrderResponse orderResponse : listOr) {
            totalAmount = totalAmount.add(orderResponse.getTotalPrice());
        }

        return totalAmount;
    }

    @Override
    public void updateMembershipTypeByTotal(HttpServletRequest request) {
        User user = jwtUtil.getUserFromRequest(request);
        BigDecimal totalAmount = totalAmount(request); // bạn đã viết hàm này

        MembershipType bronze = membershipTypeRepository.findByName("Đồng").get();
        MembershipType silver = membershipTypeRepository.findByName("Bạc").get();
        MembershipType gold = membershipTypeRepository.findByName("Vàng").get();

        if (totalAmount.compareTo(new BigDecimal("2000000")) >= 0) {
            user.setMembershipType(gold);
        } else if (totalAmount.compareTo(new BigDecimal("1000000")) >= 0) {
            user.setMembershipType(silver);
        } else {
            user.setMembershipType(bronze);
        }
        userRepository.save(user);
    }


}
