package org.example.yogabusinessmanagementweb.controller.user.lecture;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.dto.request.lecture.LectureProductAdDTO;
import org.example.yogabusinessmanagementweb.dto.response.ApiResponse;
import org.example.yogabusinessmanagementweb.dto.response.lecture.LectureProductAdResponse;
import org.example.yogabusinessmanagementweb.dto.response.lecture.LectureResponse;
import org.example.yogabusinessmanagementweb.service.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/lecture")
@Slf4j
public class LectureController {
    LecturesService lecturesService;
    LectureProductAdService adService;
    @GetMapping("/get-lecture/{courseId}/{lectureId}")
    public ApiResponse<?> getAllLectureByIdSection(HttpServletRequest request,@PathVariable String courseId, @PathVariable String lectureId) {
        LectureResponse lectureResponse = lecturesService.getLectureById(request,courseId,lectureId);
        return new ApiResponse<>(HttpStatus.OK.value(), "get lecture by id successfully",lectureResponse);
    }


    @GetMapping("/ads/{lectureId}")
    public ApiResponse<?> getAdsByLecture(@PathVariable String lectureId) {
        List<LectureProductAdResponse> ads = adService.getAdsByLectureId(lectureId);
        return new ApiResponse<>(HttpStatus.OK.value(), "Get ads by course", ads);
    }

}
