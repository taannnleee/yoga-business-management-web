package org.example.yogabusinessmanagementweb.service;

import jakarta.servlet.http.HttpServletRequest;
import org.example.yogabusinessmanagementweb.common.entities.Roadmap;
import org.example.yogabusinessmanagementweb.dto.response.roadmap.RoadmapResponse;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

public interface RoadmapService {
    List<RoadmapResponse> getRoadmap(HttpServletRequest request);
    RoadmapResponse getRoadmapById(HttpServletRequest request, @PathVariable String id);
}
