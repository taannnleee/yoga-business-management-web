package org.example.yogabusinessmanagementweb.service;

import org.example.yogabusinessmanagementweb.dto.request.lecture.LectureCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.lecture.LectureResponse;

public interface LecturesService {
    LectureResponse addLecture(LectureCreationRequest lectureCreationRequest);
}
