package org.example.yogabusinessmanagementweb.service;

import jakarta.servlet.http.HttpServletRequest;
import org.example.yogabusinessmanagementweb.common.entities.Roadmap;
import org.example.yogabusinessmanagementweb.dto.request.roadmap.RoadmapRequest;
import org.example.yogabusinessmanagementweb.dto.response.ListDto;
import org.example.yogabusinessmanagementweb.dto.response.roadmap.RoadmapResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

public interface RoadmapService {
    List<RoadmapResponse> getRoadmap(HttpServletRequest request);
    RoadmapResponse getRoadmapById(HttpServletRequest request, @PathVariable String id);

    RoadmapResponse create(RoadmapRequest roadmapRequest);
    ListDto<List<RoadmapResponse>> getRoadmapsPaged(Pageable pageable);
    RoadmapResponse deleteRoadMap(@PathVariable String id);

    RoadmapResponse updateRoadmap(Long id, RoadmapRequest request);
}
