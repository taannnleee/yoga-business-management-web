package org.example.yogabusinessmanagementweb.controller.user.course;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.common.entities.Courses;
import org.example.yogabusinessmanagementweb.dto.response.ApiResponse;
import org.example.yogabusinessmanagementweb.dto.response.section.SectionResponse;
import org.example.yogabusinessmanagementweb.dto.response.topic.TopicCourseResponse;
import org.example.yogabusinessmanagementweb.repositories.UserRepository;
import org.example.yogabusinessmanagementweb.service.*;
import org.example.yogabusinessmanagementweb.service.Impl.AuthencationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/course")
@Slf4j
public class CourseController {
    UserService userService;
    UserRepository userRepository;
    EmailService emailService;
    AuthencationService authencationService;
    ProductService productService;
    CartService cartService;
    OrderService orderService;
    CoursesService coursesService;
    SectionsService sectionsService;

    @GetMapping("/all-course")
    public ApiResponse<?> getAllCourses() {
        List<TopicCourseResponse> courseResponseList = coursesService.getAllCourseWithTopic();
        return new ApiResponse<>(HttpStatus.OK.value(), "get all courses successfully",courseResponseList);
    }

    @GetMapping("/get-all-section-by-id-course/{id}")
    public ApiResponse<?> getAllSectionByIdCourse(@PathVariable String id) {
        List<SectionResponse> sectionResponse = sectionsService.getAllSectionByIdCourse(id);
        return new ApiResponse<>(HttpStatus.OK.value(), "get section by id course successfully",sectionResponse);
    }

    @GetMapping("/get-course/{id}")
    public ApiResponse<?> getCourse(@PathVariable String id) {
        Courses courses = coursesService.getCourse(id);
        return new ApiResponse<>(HttpStatus.OK.value(), "get courses by id  successfully",courses);
    }
//    @GetMapping("/get-course/{id}")
//    public ResponseEntity<?> getCourse(@PathVariable String id) {
//        Courses course = coursesService.getCourse(id);
//
//        if (course != null) {
//            return ResponseEntity.status(HttpStatus.OK).body(course);  // Trả về đối tượng course với mã trạng thái 200 OK
//        } else {
//            // Trả về thông báo lỗi và mã trạng thái 404
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found");
//        }
//    }
}
