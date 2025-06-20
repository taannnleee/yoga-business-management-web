package org.example.yogabusinessmanagementweb.service.Impl;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.entities.Courses;
import org.example.yogabusinessmanagementweb.common.entities.Lectures;
import org.example.yogabusinessmanagementweb.common.entities.Sections;
import org.example.yogabusinessmanagementweb.common.entities.User;
import org.example.yogabusinessmanagementweb.common.mapper.LectureMapper;
import org.example.yogabusinessmanagementweb.common.util.JwtUtil;
import org.example.yogabusinessmanagementweb.dto.request.lecture.LectureCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.lecture.LectureResponse;
import org.example.yogabusinessmanagementweb.dto.response.section.SectionResponse;
import org.example.yogabusinessmanagementweb.exception.AppException;
import org.example.yogabusinessmanagementweb.exception.ErrorCode;
import org.example.yogabusinessmanagementweb.repositories.LecturesRepository;
import org.example.yogabusinessmanagementweb.repositories.SectionsRepository;
import org.example.yogabusinessmanagementweb.service.LecturesService;
import org.example.yogabusinessmanagementweb.service.OrderCourseService;
import org.example.yogabusinessmanagementweb.service.SectionsService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@Service
public class LecturesServiceImpl  implements LecturesService {
    LecturesRepository lecturesRepository;
    LectureMapper lectureMapper;

    SectionsService sectionService;

    SectionsService sectionsService;
    SectionsRepository sectionsRepository;
    JwtUtil jwtUtil;
    OrderCourseService orderCourseService;

    @Override
    public LectureResponse addLecture(LectureCreationRequest lectureCreationRequest) {
        Lectures lectures = lectureMapper.toLecture(lectureCreationRequest);
        //tìm section
        Sections  sections = sectionsService.getSectionsByid(String.valueOf(lectureCreationRequest.getIdSection()));
        sections.getLectures().add(lectures);

        // luu course va section
        sectionsRepository.save(sections);
        return lectureMapper.toLectureResponse(lectures);
    }

    @Override
    public List<LectureResponse> getAllLectureByIdSection(String id) {
        SectionResponse sectionResponse =  sectionService.getSection(id);
        List<LectureResponse> sectionsList = sectionResponse.getLectures();
        return sectionsList;
    }

    @Override
    public LectureResponse getLectureById(HttpServletRequest request, String courseId ,String lectureId) {
        //lấy user đăng kí
        User user = jwtUtil.getUserFromRequest(request);
        Optional<Lectures> lecturesOptional = lecturesRepository.findById(Long.valueOf(lectureId));
        if(lecturesOptional.isEmpty()) {
            throw new AppException(ErrorCode.LECTURE_NOT_FOUND);
        }
        Lectures lecture = lecturesOptional.get();
        if(orderCourseService.checkOrderCourse(String.valueOf(user.getId()),courseId) || lecture.getIsPublic()){

            return lectureMapper.toLectureResponse(lecture);
        }
        else{
            return null;
        }

    }

    @Override
    public Lectures getLectureEntityById(String id) {
        Optional<Lectures> lecturesOptional = lecturesRepository.findById(Long.valueOf(id));
        if(lecturesOptional.isEmpty()) {
            throw new AppException(ErrorCode.LECTURE_NOT_FOUND);
        }
        Lectures lectures = lecturesOptional.get();
        return lectures;
    }
}
