package org.example.yogabusinessmanagementweb.controller.admin.teacher;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.dto.request.teacher.TeacherCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.ApiResponse;
import org.example.yogabusinessmanagementweb.dto.response.teacher.TeacherResponse;
import org.example.yogabusinessmanagementweb.service.TeacherService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/admin")
@Slf4j
public class AdminTeacherController {
    TeacherService teacherService;

    @PostMapping("/add-teacher")
    public ApiResponse<?> getUserById(@RequestBody TeacherCreationRequest teacherCreationRequest) {
        TeacherResponse teacherResponse = teacherService.create(teacherCreationRequest);
        return new ApiResponse<>(HttpStatus.OK.value(), "create teacher success",teacherResponse );
    }

    @GetMapping("/all-teachers")
    public ApiResponse<?> getAllTeacher() {
        List<TeacherResponse> list = teacherService.getAllTeacher();
        return new ApiResponse<>(HttpStatus.OK.value(), "get all teacher success",list );
    }

}
