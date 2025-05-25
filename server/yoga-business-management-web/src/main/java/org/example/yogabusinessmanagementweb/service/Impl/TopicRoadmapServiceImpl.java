package org.example.yogabusinessmanagementweb.service.Impl;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.entities.Roadmap;
import org.example.yogabusinessmanagementweb.common.entities.TopicRoadmap;
import org.example.yogabusinessmanagementweb.dto.response.roadmap.RoadmapResponse;
import org.example.yogabusinessmanagementweb.exception.AppException;
import org.example.yogabusinessmanagementweb.exception.ErrorCode;
import org.example.yogabusinessmanagementweb.repositories.TopicRoadmapRepository;
import org.example.yogabusinessmanagementweb.service.TopicRoadmapService;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@Service
public class TopicRoadmapServiceImpl implements TopicRoadmapService {
    TopicRoadmapRepository topicRoadmapRepository;

    @Override
    public List<TopicRoadmap> getRoadmapById(HttpServletRequest request, String id) {

        List<TopicRoadmap> list =  topicRoadmapRepository.findAllById(Long.valueOf(id));
        return list;
    }

    public TopicRoadmap getTopicRoadmapById(Long id) {
        return topicRoadmapRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.TOPIC_ROADMAP_NOT_FOUND));
    }
}
