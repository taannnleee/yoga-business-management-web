package org.example.yogabusinessmanagementweb.controller.user.topicRoadmap;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.common.entities.TopicRoadmap;
import org.example.yogabusinessmanagementweb.dto.response.ApiResponse;
import org.example.yogabusinessmanagementweb.service.TopicRoadmapService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/topic-roadmap")
@Slf4j
public class TopicRoadmapController {
    TopicRoadmapService topicRoadmapService;

    @GetMapping("/{id}")
    public ApiResponse<?> getRoadmapById(HttpServletRequest request, @PathVariable String id) {
        List<TopicRoadmap> list  = topicRoadmapService.getRoadmapById(request, id);
        return new ApiResponse<>(HttpStatus.OK.value(), "get topic roadmap success",list);
    }
}
