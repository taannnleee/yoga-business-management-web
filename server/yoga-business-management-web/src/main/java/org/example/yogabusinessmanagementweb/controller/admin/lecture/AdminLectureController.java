package org.example.yogabusinessmanagementweb.controller.admin.lecture;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.dto.request.course.CourseCreationRequest;
import org.example.yogabusinessmanagementweb.dto.request.lecture.LectureCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.ApiResponse;
import org.example.yogabusinessmanagementweb.dto.response.course.CourseResponse;
import org.example.yogabusinessmanagementweb.dto.response.lecture.LectureResponse;
import org.example.yogabusinessmanagementweb.service.CoursesService;
import org.example.yogabusinessmanagementweb.service.LecturesService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/admin")
@Slf4j
public class AdminLectureController {
    LecturesService lecturesService;

    @PostMapping("/add-lecture")
    public ApiResponse<?> createCourse(@RequestBody LectureCreationRequest lectureCreationRequest) {
        LectureResponse lectureResponse = lecturesService.addLecture(lectureCreationRequest);
        return new ApiResponse<>(HttpStatus.OK.value(), "create lecture successfully",lectureResponse);
    }
}
