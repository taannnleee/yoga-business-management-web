package org.example.yogabusinessmanagementweb.service;

import org.example.yogabusinessmanagementweb.common.entities.Courses;
import org.example.yogabusinessmanagementweb.dto.request.course.CourseCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.course.CourseResponse;

import java.util.List;

public interface CoursesService {
    Courses getCourseByid(String id);
    CourseResponse addCourse(CourseCreationRequest courseCreationRequest);

    List<CourseResponse> getAllCourse();
}
