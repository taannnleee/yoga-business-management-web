package org.example.yogabusinessmanagementweb.controller.user.roadmap;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.common.entities.LectureDone;
import org.example.yogabusinessmanagementweb.common.entities.Promotion;
import org.example.yogabusinessmanagementweb.common.entities.Roadmap;
import org.example.yogabusinessmanagementweb.dto.request.promotion.PromotionRequest;
import org.example.yogabusinessmanagementweb.dto.request.roadmap.RoadmapRequest;
import org.example.yogabusinessmanagementweb.dto.response.roadmap.RoadmapResponse;
import org.example.yogabusinessmanagementweb.dto.response.ApiResponse;
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

    RoadmapService roadmapService;
    @GetMapping()
    public ApiResponse<?> getAllRoadmap(HttpServletRequest request) {
        List<RoadmapResponse> list  = roadmapService.getRoadmap(request);
        return new ApiResponse<>(HttpStatus.OK.value(), "show roadmap success",list);
    }

    @GetMapping("/{id}")
    public ApiResponse<?> getRoadmapById(HttpServletRequest request, @PathVariable String id) {
        RoadmapResponse response  = roadmapService.getRoadmapById(request, id);
        return new ApiResponse<>(HttpStatus.OK.value(), "get topic roadmap success",response);
    }


}
