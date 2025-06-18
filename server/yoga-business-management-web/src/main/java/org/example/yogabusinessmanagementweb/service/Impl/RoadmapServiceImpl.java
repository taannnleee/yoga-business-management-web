package org.example.yogabusinessmanagementweb.service.Impl;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.entities.Courses;
import org.example.yogabusinessmanagementweb.common.entities.Roadmap;
import org.example.yogabusinessmanagementweb.common.entities.TopicRoadMap_Course;
import org.example.yogabusinessmanagementweb.common.entities.TopicRoadmap;
import org.example.yogabusinessmanagementweb.common.mapper.GenericMapper;
import org.example.yogabusinessmanagementweb.common.mapper.RoadMapMapper;
import org.example.yogabusinessmanagementweb.common.util.JwtUtil;
import org.example.yogabusinessmanagementweb.dto.request.course.CourseRequest;
import org.example.yogabusinessmanagementweb.dto.request.roadmap.RoadmapRequest;
import org.example.yogabusinessmanagementweb.dto.request.roadmap.TopicRoadmapRequest;
import org.example.yogabusinessmanagementweb.dto.response.ListDto;
import org.example.yogabusinessmanagementweb.dto.response.course.CourseResponse;
import org.example.yogabusinessmanagementweb.dto.response.roadmap.RoadmapResponse;
import org.example.yogabusinessmanagementweb.dto.response.roadmap.TopicRoadMapResponse;
import org.example.yogabusinessmanagementweb.exception.AppException;
import org.example.yogabusinessmanagementweb.exception.ErrorCode;
import org.example.yogabusinessmanagementweb.repositories.CoursesRepository;
import org.example.yogabusinessmanagementweb.repositories.RoadmapRepository;
import org.example.yogabusinessmanagementweb.repositories.TopicRoadmapCourseRepository;
import org.example.yogabusinessmanagementweb.repositories.TopicRoadmapRepository;
import org.example.yogabusinessmanagementweb.service.RoadmapService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    CoursesRepository coursesRepository;
    TopicRoadmapRepository topicRoadmapRepository;


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
    @Transactional
    public RoadmapResponse create(RoadmapRequest roadmapRequest) {
        // 1. Tạo danh sách topicRoadmap entity
        List<TopicRoadmap> topicRoadmaps = roadmapRequest.getTopicRoadmaps().stream()
                .map(req -> TopicRoadmap.builder()
                        .title(req.getTitle())
                        .content(req.getContent())
                        .build())
                .collect(Collectors.toList());

        // 2. Tạo và lưu roadmap
        Roadmap roadmap = Roadmap.builder()
                .title(roadmapRequest.getTitle())
                .description(roadmapRequest.getDescription())
                .topicRoadmaps(topicRoadmaps)
                .build();

        roadmapRepository.save(roadmap); // cascade topicRoadmaps nếu cần

        // 3. Lưu bảng trung gian: TopicRoadMap_Course
        for (int i = 0; i < topicRoadmaps.size(); i++) {
            TopicRoadmap topicEntity = topicRoadmaps.get(i);
            TopicRoadmapRequest topicRequest = roadmapRequest.getTopicRoadmaps().get(i);

            if (topicRequest.getCourses() != null) {
                for (CourseRequest courseReq : topicRequest.getCourses()) {
                    Courses course = coursesRepository.findById(courseReq.getId())
                            .orElseThrow(() -> new RuntimeException("Không tìm thấy khóa học với ID: " + courseReq.getId()));

                    TopicRoadMap_Course link = TopicRoadMap_Course.builder()
                            .topicRoadmap(topicEntity)
                            .course(course)
                            .build();

                    topicRoadmapCourseRepository.save(link);
                }
            }
        }

        return roadMapMapper.toRoadMapCreationRequest(roadmap);
    }

    @Override
    public ListDto<List<RoadmapResponse>> getRoadmapsPaged(Pageable pageable) {
        Page<Roadmap> page = roadmapRepository.findAll(pageable);
        List<RoadmapResponse> roadmapResponses = new ArrayList<>();

        for (Roadmap roadmap : page.getContent()) {
            RoadmapResponse roadmapResponse = new RoadmapResponse();
            roadmapResponse.setId(roadmap.getId());
            roadmapResponse.setTitle(roadmap.getTitle());
            roadmapResponse.setDescription(roadmap.getDescription());

            List<TopicRoadMapResponse> topicResponses = new ArrayList<>();
            for (TopicRoadmap topic : roadmap.getTopicRoadmaps()) {
                TopicRoadMapResponse topicResponse = new TopicRoadMapResponse();
                topicResponse.setId(topic.getId());
                topicResponse.setTitle(topic.getTitle());
                topicResponse.setContent(topic.getContent());

                // Lấy danh sách course của topic
                List<TopicRoadMap_Course> mappings = topicRoadmapCourseRepository.findAllByTopicRoadmap(topic);
                List<CourseResponse> courses = mappings.stream().map(mapping -> {
                    Courses c = mapping.getCourse();
                    CourseResponse cr = new CourseResponse();
                    cr.setId(c.getId());
                    cr.setName(c.getName());
                    cr.setDescription(c.getDescription());
                    cr.setPrice(c.getPrice());
                    cr.setImagePath(c.getImagePath());
                    return cr;
                }).collect(Collectors.toList());

                topicResponse.setCourse(courses);
                topicResponses.add(topicResponse);
            }

            roadmapResponse.setTopicRoadmapsResponse(topicResponses);
            roadmapResponses.add(roadmapResponse);
        }

        return GenericMapper.toListDto(roadmapResponses, page);
    }

    @Override
    @Transactional
    public RoadmapResponse deleteRoadMap(String id) {
        Long roadmapId;
        try {
            roadmapId = Long.parseLong(id);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("ID không hợp lệ: " + id);
        }

        Roadmap roadmap = roadmapRepository.findById(roadmapId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lộ trình với ID: " + id));

        // Nếu bạn không dùng cascade = REMOVE thì xóa thủ công các bảng liên quan
        for (TopicRoadmap topic : roadmap.getTopicRoadmaps()) {
            topicRoadmapCourseRepository.deleteByTopicRoadmap(topic); // xóa bảng trung gian
        }

        roadmapRepository.delete(roadmap); // xóa chính lộ trình

        return roadMapMapper.toRoadMapCreationRequest(roadmap); // trả về thông tin đã xóa nếu cần
    }

    @Override
    @Transactional
    public RoadmapResponse updateRoadmap(Long id, RoadmapRequest request) {
        // 1. Tìm lộ trình
        Roadmap roadmap = roadmapRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROAD_MAP_NOT_FOUND));

        // 2. Cập nhật thông tin cơ bản
        roadmap.setTitle(request.getTitle());
        roadmap.setDescription(request.getDescription());

        // 3. Xóa liên kết topic cũ (cả bảng phụ)
        List<TopicRoadmap> oldTopics = roadmap.getTopicRoadmaps();
        for (TopicRoadmap topic : oldTopics) {
            topicRoadmapCourseRepository.deleteAllByTopicRoadmap(topic);
        }
        topicRoadmapRepository.deleteAll(oldTopics);

        roadmap.getTopicRoadmaps().clear();

        // 4. Tạo mới danh sách Topic + gán Course
        for (TopicRoadmapRequest topicReq : request.getTopicRoadmaps()) {
            // Tạo mới topic
            TopicRoadmap newTopic = TopicRoadmap.builder()
                    .title(topicReq.getTitle())
                    .content(topicReq.getContent())
                    .build();

            TopicRoadmap savedTopic = topicRoadmapRepository.save(newTopic);

            // Gán vào roadmap
            roadmap.getTopicRoadmaps().add(savedTopic);

            // Gán course vào topic (nếu có)
            if (topicReq.getCourses() != null) {
                for (CourseRequest courseDto : topicReq.getCourses()) {
                    Courses course = coursesRepository.findById(courseDto.getId())
                            .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));

                    TopicRoadMap_Course relation = TopicRoadMap_Course.builder()
                            .course(course)
                            .topicRoadmap(savedTopic)
                            .build();

                    topicRoadmapCourseRepository.save(relation);
                }
            }
        }

        // 5. Lưu roadmap
        roadmapRepository.save(roadmap);

        // 6. Trả kết quả
        return roadMapMapper.toRoadMapCreationRequest(roadmap);
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
