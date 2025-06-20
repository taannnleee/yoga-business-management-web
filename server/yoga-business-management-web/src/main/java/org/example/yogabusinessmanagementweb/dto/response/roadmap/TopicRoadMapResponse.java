package org.example.yogabusinessmanagementweb.dto.response.roadmap;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.entities.Courses;
import org.example.yogabusinessmanagementweb.dto.response.course.CourseResponse;

import java.util.List;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class TopicRoadMapResponse {
    Long id;
    String title;        // Ví dụ: "Giảm cân", "Dẻo dai", "Thư giãn"
    String content;
    List<CourseResponse> course;
}
