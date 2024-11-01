package org.example.yogabusinessmanagementweb.service.Impl;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.entities.Teacher;
import org.example.yogabusinessmanagementweb.common.mapper.TeacherMapper;
import org.example.yogabusinessmanagementweb.dto.request.teacher.TeacherCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.teacher.TeacherResponse;
import org.example.yogabusinessmanagementweb.exception.AppException;
import org.example.yogabusinessmanagementweb.exception.ErrorCode;
import org.example.yogabusinessmanagementweb.repositories.TeacherRepository;
import org.example.yogabusinessmanagementweb.service.TeacherService;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@Service
public class TeacherServiceImpl implements TeacherService {
    TeacherRepository teacherRepository;
    TeacherMapper teacherMapper;

    @Override
    public TeacherResponse create(TeacherCreationRequest teacherCreationRequest) {
        Teacher teacher =  teacherMapper.toTeacher(teacherCreationRequest);
        teacherRepository.save(teacher);
        return teacherMapper.toTeacherResponse(teacher);
    }

    @Override
    public List<TeacherResponse> getAllTeacher() {
        List<Teacher> teachers = teacherRepository.findAll();
        List<TeacherResponse> list =  teacherMapper.toTeacherResponseList(teachers);
        return list;
    }

    @Override
    public Teacher getTeacherByid(String id) {
        return teacherRepository.findById(Long.valueOf(id)).orElseThrow(()-> new AppException(ErrorCode.TEACHER_NOT_FOUND));
    }
}
