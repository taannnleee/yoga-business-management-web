package org.example.yogabusinessmanagementweb.service.Impl;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.entities.*;
import org.example.yogabusinessmanagementweb.common.mapper.CourseMapper;
import org.example.yogabusinessmanagementweb.common.util.JwtUtil;
import org.example.yogabusinessmanagementweb.dto.request.course.CourseCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.course.CourseResponse;
import org.example.yogabusinessmanagementweb.dto.response.course.CourseResponsePageDetail;
import org.example.yogabusinessmanagementweb.dto.response.course.LectureResponsePageDetail;
import org.example.yogabusinessmanagementweb.dto.response.course.SectionResponsePageDetail;
import org.example.yogabusinessmanagementweb.dto.response.topic.TopicCourseResponse;
import org.example.yogabusinessmanagementweb.exception.AppException;
import org.example.yogabusinessmanagementweb.exception.ErrorCode;
import org.example.yogabusinessmanagementweb.repositories.CoursesRepository;
import org.example.yogabusinessmanagementweb.repositories.TeacherRepository;
import org.example.yogabusinessmanagementweb.repositories.TopicRepository;
import org.example.yogabusinessmanagementweb.service.*;
import org.hibernate.validator.internal.util.stereotypes.Lazy;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@Service
public class CoursesServiceImpl implements CoursesService {

    CoursesRepository coursesRepository;
    CourseMapper courseMapper;
    TeacherService teacherService;
    TopicService topicService;
    OrderCourseService orderCourseService;
    JwtUtil jwtUtil;
    LectureDoneService lectureDoneService;

    TopicRepository topicRepository;



    @Override
    public CourseResponse addCourse(CourseCreationRequest courseCreationRequest) {
        Courses courses = courseMapper.toCourses(courseCreationRequest);
        Teacher teacher  =  teacherService.getTeacherByid(courseCreationRequest.getTeacherId());
        Topic topic  =  topicService.getTopicByid(courseCreationRequest.getTopicId());

        //set teacher và topic vào course
        courses.setTeacher(teacher);
        courses.setTopic(topic);
        coursesRepository.save(courses);
        return  courseMapper.toCoursesResponse(courses);
    }

    @Override
    public List<CourseResponse> getAllCourse() {
        List<Courses> coursesList =  coursesRepository.findAll();
        List<CourseResponse> courseResponses =  courseMapper.toCoursesResponseList(coursesList);
        return courseResponses;
    }

    @Override
    public List<TopicCourseResponse> getAllCourseWithTopic() {

        List<TopicCourseResponse> topicCourseResponses = new ArrayList<>();

        List<Topic> topics = topicRepository.findAll();
        for(Topic topic : topics){
            TopicCourseResponse topicCourseResponse = new TopicCourseResponse();
            topicCourseResponse.setTopicName(topic.getName());

            List<Courses> topicList = coursesRepository.findAllByTopic(topic);

            List<CourseResponse> courseResponses = courseMapper.toCoursesResponseList(topicList);
            topicCourseResponse.setCourse(courseResponses);

            topicCourseResponses.add(topicCourseResponse);
        }

        return topicCourseResponses;
    }

    @Override
    public CourseResponsePageDetail getCourse(HttpServletRequest request, String id) {
        //lấy user đăng kí
        User user = jwtUtil.getUserFromRequest(request);

        Optional<Courses> coursesOptional = coursesRepository.findById(Long.valueOf(id));
        if(coursesOptional.isEmpty()){
            throw new AppException(ErrorCode.COURSE_NOT_FOUND);
        }
        Courses courses = coursesOptional.get();

        if(orderCourseService.checkOrderCourse(String.valueOf(user.getId()),id)){
            List<Sections> sectionsList =  courses.getSections();
            for(Sections sections : sectionsList){
                List<Lectures> lecturesList = sections.getLectures();
                for(Lectures lectures : lecturesList){
                    lectures.setIsPublic(true);
                }
            }
        }

        CourseResponsePageDetail courseResponsePageDetail =  courseMapper.toCourseResponsePageDetail(courses);
        // đánh dấu khóa học đã hoàn thành
        List<Long> doneLectureIds = lectureDoneService.getLectureDone(user)
                .stream()
                .map(ld -> ld.getLectures().getId())
                .collect(Collectors.toList());

        for (SectionResponsePageDetail sectionDto : courseResponsePageDetail.getSections()) {
            for (LectureResponsePageDetail lectureDto : sectionDto.getLectures()) {
                lectureDto.setIsDone(doneLectureIds.contains(lectureDto.getId())); // dùng List
            }
        }



        return courseResponsePageDetail;
    }

    @Override
    public Courses getCourseByFilterLecture(HttpServletRequest request, String id) {
        //lấy user đăng kí
        User user = jwtUtil.getUserFromRequest(request);

        Optional<Courses> coursesOptional = coursesRepository.findById(Long.valueOf(id));
        if(coursesOptional.isEmpty()){
            throw new AppException(ErrorCode.COURSE_NOT_FOUND);
        }
        Courses courses = coursesOptional.get();

        if(orderCourseService.checkOrderCourse(String.valueOf(user.getId()),id)){
            List<Sections> sectionsList =  courses.getSections();
            for(Sections sections : sectionsList){
                List<Lectures> lecturesList = sections.getLectures();
                for(Lectures lectures : lecturesList){
                    lectures.setIsPublic(true);
                }
            }
        }
        // Bây giờ lọc danh sách lectures của từng section
        for (Sections sections : courses.getSections()) {
            List<Lectures> filteredLectures = sections.getLectures().stream()
                    .filter(Lectures::getIsPublic)  // Lọc lectures có isPublic == true
                    .collect(Collectors.toList());
            sections.setLectures(filteredLectures);  // Gán danh sách mới
        }
        return courses;
    }

    @Override
    public List<CourseResponse> allTeacherCourses(String id) {
        Teacher teacher = teacherService.getTeacherByid(id);
        List<Courses> coursesList =  coursesRepository.findAllByTeacher(teacher);
        List<CourseResponse> courseResponseList = courseMapper.toCoursesResponseList(coursesList);
        return courseResponseList;
    }

    @Override
    public List<CourseResponse> getOutstandingCourses() {
        List<Courses> coursesList =  coursesRepository.findTop6ByOrderByIdAsc();
        List<CourseResponse> courseResponses =  courseMapper.toCoursesResponseList(coursesList);
        return courseResponses;
    }

    @Override
    public Courses getCourseByid(String id) {
        return coursesRepository.findById(Long.valueOf(id)).orElseThrow(()-> new AppException(ErrorCode.COURSE_NOT_FOUND));
    }
}
