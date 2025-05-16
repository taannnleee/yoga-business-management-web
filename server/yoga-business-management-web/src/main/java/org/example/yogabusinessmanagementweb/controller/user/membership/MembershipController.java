package org.example.yogabusinessmanagementweb.controller.user.membership;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.common.entities.MembershipType;
import org.example.yogabusinessmanagementweb.dto.request.cart.CartCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.ApiResponse;
import org.example.yogabusinessmanagementweb.dto.response.cart.CartResponse;
import org.example.yogabusinessmanagementweb.dto.response.lecture.LectureResponse;
import org.example.yogabusinessmanagementweb.service.MembershipService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@RequestMapping("/api/membership")
public class MembershipController {
    MembershipService membershipService;
    @GetMapping("/type")
    public ApiResponse<?> getMembershipType(HttpServletRequest request) {
        MembershipType membershipType =  membershipService.getMembershipType(request);
        return new ApiResponse<>(HttpStatus.OK.value(), "get membershipType success",membershipType);
    }

    // hàm tính tổng tiền mà người dùng đã mua trong hệ thống bao gồm việc mua khóa học và mua ecomer

    @GetMapping("/total")
    public ApiResponse<?> totalAmount(HttpServletRequest request) {
        BigDecimal totalAmount =  membershipService.totalAmount(request);
        return new ApiResponse<>(HttpStatus.OK.value(), "get total amount success",totalAmount);
    }
}
