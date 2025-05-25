package org.example.yogabusinessmanagementweb.service.Impl;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.entities.Courses;
import org.example.yogabusinessmanagementweb.common.entities.Roadmap;
import org.example.yogabusinessmanagementweb.common.entities.TopicRoadMap_Course;
import org.example.yogabusinessmanagementweb.common.entities.TopicRoadmap;
import org.example.yogabusinessmanagementweb.common.mapper.RoadMapMapper;
import org.example.yogabusinessmanagementweb.common.util.JwtUtil;
import org.example.yogabusinessmanagementweb.dto.response.course.CourseResponse;
import org.example.yogabusinessmanagementweb.dto.response.roadmap.RoadmapResponse;
import org.example.yogabusinessmanagementweb.dto.response.roadmap.TopicRoadMapResponse;
import org.example.yogabusinessmanagementweb.exception.AppException;
import org.example.yogabusinessmanagementweb.exception.ErrorCode;
import org.example.yogabusinessmanagementweb.repositories.RoadmapRepository;
import org.example.yogabusinessmanagementweb.repositories.TopicRoadmapCourseRepository;
import org.example.yogabusinessmanagementweb.repositories.TopicRoadmapRepository;
import org.example.yogabusinessmanagementweb.service.RoadmapService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@Service
public class RoadmapServiceImpl implements RoadmapService {
    RoadmapRepository roadmapRepository;
    TopicRoadmapCourseRepository topicRoadmapCourseRepository;
    TopicRoadmapRepository topicRoadMapRepository;
    JwtUtil jwtUtil;
    RoadMapMapper roadMapMapper;


    @Override
    public RoadmapResponse getRoadmapById(HttpServletRequest request, String id) {
        // Lấy roadmap từ DB
        Roadmap roadmap = getRoadmapById(Long.valueOf(id));

        // Dùng MapStruct để ánh xạ thông tin chung
        RoadmapResponse roadmapResponse = roadMapMapper.toRoadMapCreationRequest(roadmap);

        // Danh sách topicRoadmapResponse sau khi thêm courses
        List<TopicRoadMapResponse> topicRoadMapResponseList = new ArrayList<>();

        for (TopicRoadmap topicRoadmap : roadmap.getTopicRoadmaps()) {
            // Lấy danh sách ánh xạ TopicRoadMap_Course tương ứng với mỗi TopicRoadmap
            List<TopicRoadMap_Course> mappings = topicRoadmapCourseRepository.findAllByTopicRoadmap(topicRoadmap);

            // Chuyển sang CourseResponse
            List<CourseResponse> courseResponses = mappings.stream()
                    .map(mapping -> {
                        Courses c = mapping.getCourse();
                        CourseResponse cr = new CourseResponse();
                        cr.setId(c.getId());
                        cr.setName(c.getName());
                        cr.setDescription(c.getDescription());
                        cr.setPrice(c.getPrice());
                        cr.setImagePath(c.getImagePath());
                        return cr;
                    }).collect(Collectors.toList());

            // Ánh xạ topicRoadmap entity → topicRoadmapResponse DTO
            TopicRoadMapResponse trResponse = new TopicRoadMapResponse();
            trResponse.setId(topicRoadmap.getId());
            trResponse.setTitle(topicRoadmap.getTitle());
            trResponse.setContent(topicRoadmap.getContent());
            trResponse.setCourse(courseResponses);

            topicRoadMapResponseList.add(trResponse);
        }

        // Gắn danh sách topicRoadmaps đã xử lý vào response
        roadmapResponse.setTopicRoadmapsResponse(topicRoadMapResponseList);

        return roadmapResponse;
    }



    @Override
    public List<RoadmapResponse> getRoadmap(HttpServletRequest request) {
        List<RoadmapResponse> roadmapResponses = new ArrayList<>();
        List<Roadmap> listRoadmap =  roadmapRepository.findAll();
        for(Roadmap roadmap : listRoadmap){
            roadmapResponses.add(roadMapMapper.toRoadMapCreationRequest(roadmap));
        }
        return roadmapResponses;
    }

    public Roadmap getRoadmapById(Long id) {
        return roadmapRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROAD_MAP_NOT_FOUND));
    }


}
