package org.example.yogabusinessmanagementweb.service.Impl;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.entities.LectureDone;
import org.example.yogabusinessmanagementweb.common.entities.Lectures;
import org.example.yogabusinessmanagementweb.common.entities.Topic;
import org.example.yogabusinessmanagementweb.common.entities.User;
import org.example.yogabusinessmanagementweb.common.util.JwtUtil;
import org.example.yogabusinessmanagementweb.exception.AppException;
import org.example.yogabusinessmanagementweb.exception.ErrorCode;
import org.example.yogabusinessmanagementweb.repositories.LectureDoneRepository;
import org.example.yogabusinessmanagementweb.repositories.LecturesRepository;
import org.example.yogabusinessmanagementweb.service.AccountService;
import org.example.yogabusinessmanagementweb.service.LectureDoneService;
import org.example.yogabusinessmanagementweb.service.LecturesService;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class LectureDoneServiceImpl implements LectureDoneService {
    LectureDoneRepository lectureDoneRepository;
    JwtUtil jwtUtil;
    LecturesRepository lectureRepository;

    @Override
    public List<LectureDone> getLectureDone(User user) {
        List<LectureDone> lectureDone = lectureDoneRepository.findAllByUser(user);
        return lectureDone;
    }

    @Override
    public LectureDone markLectureAsDone(HttpServletRequest request, Long lectureId) {
        User user = jwtUtil.getUserFromRequest(request);
        Lectures lecture = lectureRepository.findById(lectureId).orElseThrow((()->new AppException(ErrorCode.LECTURE_NOT_FOUND)));

        // Kiểm tra nếu đã có thì không tạo nữa
        Optional<LectureDone> existing = lectureDoneRepository.findByUserAndLectures(user, lecture);
        if (existing.isPresent()) {
            return existing.get(); // Đã đánh dấu rồi
        }

        LectureDone lectureDone = new LectureDone();
        lectureDone.setUser(user);
        lectureDone.setLectures(lecture);

        return lectureDoneRepository.save(lectureDone);
    }

    @Override
    public LectureDone unmarkLectureAsDone(HttpServletRequest request, Long lectureId) {
        Lectures lecture = lectureRepository.findById(lectureId).orElseThrow((()->new AppException(ErrorCode.LECTURE_NOT_FOUND)));
        User user = jwtUtil.getUserFromRequest(request);
        Optional<LectureDone> lectureDone = lectureDoneRepository.findByUserAndLectures(user, lecture);
        if (lectureDone.isPresent()) {
            lectureDoneRepository.delete(lectureDone.get());
        }
        return lectureDone.get();
    }
}
