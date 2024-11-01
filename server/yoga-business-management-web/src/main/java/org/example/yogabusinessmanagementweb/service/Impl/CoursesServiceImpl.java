package org.example.yogabusinessmanagementweb.service.Impl;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.entities.Courses;
import org.example.yogabusinessmanagementweb.common.entities.Teacher;
import org.example.yogabusinessmanagementweb.common.entities.Topic;
import org.example.yogabusinessmanagementweb.common.mapper.CourseMapper;
import org.example.yogabusinessmanagementweb.dto.request.course.CourseCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.course.CourseResponse;
import org.example.yogabusinessmanagementweb.exception.AppException;
import org.example.yogabusinessmanagementweb.exception.ErrorCode;
import org.example.yogabusinessmanagementweb.repositories.CoursesRepository;
import org.example.yogabusinessmanagementweb.service.CoursesService;
import org.example.yogabusinessmanagementweb.service.TeacherService;
import org.example.yogabusinessmanagementweb.service.TopicService;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@Service
public class CoursesServiceImpl implements CoursesService {
    CoursesRepository coursesRepository;
    CourseMapper courseMapper;
    TeacherService teacherService;
    TopicService topicService;

    @Override
    public CourseResponse addCourse(CourseCreationRequest courseCreationRequest) {
        Courses courses = courseMapper.toCourses(courseCreationRequest);
        Teacher teacher  =  teacherService.getTeacherByid(courseCreationRequest.getTeacherId());
        Topic topic  =  topicService.getTopicByid(courseCreationRequest.getTopicId());

        //set teacher và topic vào course
        courses.setTeacher(teacher);
        courses.setTopic(topic);
        coursesRepository.save(courses);
        return  courseMapper.toCoursesResponse(courses);
    }

    @Override
    public List<CourseResponse> getAllCourse() {
        List<Courses> coursesList =  coursesRepository.findAll();
        List<CourseResponse> courseResponses =  courseMapper.toCoursesResponseList(coursesList);
        return courseResponses;
    }

    @Override
    public Courses getCourseByid(String id) {
        return coursesRepository.findById(Long.valueOf(id)).orElseThrow(()-> new AppException(ErrorCode.COURSE_NOT_FOUND));
    }
}
