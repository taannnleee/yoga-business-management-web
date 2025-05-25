package org.example.yogabusinessmanagementweb.controller.user.roadmap;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.common.entities.Roadmap;
import org.example.yogabusinessmanagementweb.dto.request.orderCourse.OrderCourseCreationRequest;
import org.example.yogabusinessmanagementweb.dto.request.roadmap.RoadmapCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.ApiResponse;
import org.example.yogabusinessmanagementweb.dto.response.orderCourse.OrderCourseResponse;
import org.example.yogabusinessmanagementweb.service.MembershipService;
import org.example.yogabusinessmanagementweb.service.OrderCourseService;
import org.example.yogabusinessmanagementweb.service.RoadmapService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/roadmap")
@Slf4j
public class RoadmapController {
    
//
//    @PostMapping("/create")
//    public ApiResponse<?> createOrderCourse(HttpServletRequest request,@RequestBody OrderCourseCreationRequest orderCourseCreationRequest) {
//        orderCourseService.createOrderCourse(orderCourseCreationRequest);
//        membershipService.updateMembershipTypeByTotal(request);
//        return new ApiResponse<>(HttpStatus.OK.value(), "create course order success");
//    }

    RoadmapService roadmapService;
    @GetMapping()
    public ApiResponse<?> getRoadmap(HttpServletRequest request) {
        List<RoadmapCreationRequest> list  = roadmapService.getRoadmap(request);
        return new ApiResponse<>(HttpStatus.OK.value(), "show roadmap success",list);
    }
}
