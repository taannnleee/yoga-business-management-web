package org.example.yogabusinessmanagementweb.service;

import jakarta.servlet.http.HttpServletRequest;
import org.example.yogabusinessmanagementweb.common.entities.Courses;
import org.example.yogabusinessmanagementweb.dto.request.course.CourseCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.course.CourseResponse;
import org.example.yogabusinessmanagementweb.dto.response.course.CourseResponsePageDetail;
import org.example.yogabusinessmanagementweb.dto.response.topic.TopicCourseResponse;

import java.util.List;

public interface CoursesService {
    Courses getCourseByid(String id);
    CourseResponse addCourse(CourseCreationRequest courseCreationRequest);

    List<CourseResponse> getAllCourse();

    List<TopicCourseResponse> getAllCourseWithTopic();

    CourseResponsePageDetail getCourse(HttpServletRequest request, String id);
    Courses getCourseByFilterLecture(HttpServletRequest request, String id);

    List<CourseResponse> allTeacherCourses(String id);

    List<CourseResponse> getOutstandingCourses();
}
