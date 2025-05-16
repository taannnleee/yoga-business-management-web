package org.example.yogabusinessmanagementweb.service;

import org.example.yogabusinessmanagementweb.common.entities.Lectures;
import org.example.yogabusinessmanagementweb.dto.request.lecture.LectureProductAdDTO;
import org.example.yogabusinessmanagementweb.dto.response.lecture.LectureProductAdResponse;

import java.util.List;

public interface LectureProductAdService {
    List<LectureProductAdResponse> getAdsByLectureId(String lectureId);
    void addLectureProductAds(LectureProductAdDTO dto);
}
