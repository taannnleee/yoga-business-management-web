package org.example.yogabusinessmanagementweb.service;

import jakarta.servlet.http.HttpServletRequest;
import org.example.yogabusinessmanagementweb.common.entities.Lectures;
import org.example.yogabusinessmanagementweb.dto.request.lecture.LectureProductAdDTO;
import org.example.yogabusinessmanagementweb.dto.request.lecture.LectureCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.lecture.LectureProductAdResponse;
import org.example.yogabusinessmanagementweb.dto.response.lecture.LectureResponse;

import java.util.List;

public interface LecturesService {
    LectureResponse addLecture(LectureCreationRequest lectureCreationRequest);

    List<LectureResponse> getAllLectureByIdSection(String id);

    LectureResponse getLectureById(HttpServletRequest request, String courseId ,String lectureId);
    Lectures getLectureEntityById(String id);

}
