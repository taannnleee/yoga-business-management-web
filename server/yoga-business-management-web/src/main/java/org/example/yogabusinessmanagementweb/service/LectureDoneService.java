package org.example.yogabusinessmanagementweb.service;

import jakarta.servlet.http.HttpServletRequest;
import org.example.yogabusinessmanagementweb.common.entities.LectureDone;
import org.example.yogabusinessmanagementweb.common.entities.Lectures;
import org.example.yogabusinessmanagementweb.common.entities.User;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

public interface LectureDoneService {
    List<LectureDone> getLectureDone(User user);
    LectureDone markLectureAsDone(HttpServletRequest request, @PathVariable Long lectureId);
    LectureDone unmarkLectureAsDone(HttpServletRequest request, @PathVariable Long lectureId);
}
