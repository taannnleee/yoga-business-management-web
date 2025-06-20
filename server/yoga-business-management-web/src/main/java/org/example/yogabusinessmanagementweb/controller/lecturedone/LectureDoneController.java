package org.example.yogabusinessmanagementweb.controller.lecturedone;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.common.entities.LectureDone;
import org.example.yogabusinessmanagementweb.dto.request.cart.CartCreationRequest;
import org.example.yogabusinessmanagementweb.dto.request.cart.CartDeleteMultipleRequest;
import org.example.yogabusinessmanagementweb.dto.request.cart.CartDeleteRequest;
import org.example.yogabusinessmanagementweb.dto.request.cart.CartItemCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.ApiResponse;
import org.example.yogabusinessmanagementweb.dto.response.cart.CartItemResponse;
import org.example.yogabusinessmanagementweb.dto.response.cart.CartResponse;
import org.example.yogabusinessmanagementweb.repositories.UserRepository;
import org.example.yogabusinessmanagementweb.service.*;
import org.example.yogabusinessmanagementweb.service.Impl.AuthencationService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/lecture-done")
@Slf4j
public class LectureDoneController {
    LectureDoneService lectureDoneService;
    @PostMapping("/{lectureId}")
    public ApiResponse<?> markLectureAsDone(HttpServletRequest request, @PathVariable Long lectureId) {
        LectureDone lectureDone = lectureDoneService.markLectureAsDone(request,lectureId);
        return new ApiResponse<>(HttpStatus.OK.value(), "add lecture done",lectureDone);
    }

    @DeleteMapping("/{lectureId}")
    public ApiResponse<?> unmarkLectureAsDone(HttpServletRequest request, @PathVariable Long lectureId) {
        LectureDone lectureDone = lectureDoneService.unmarkLectureAsDone(request,lectureId);
        return new ApiResponse<>(HttpStatus.OK.value(), "delete lecture done",lectureDone);
    }
}
