package org.example.yogabusinessmanagementweb.dto.response.course;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.entities.Sections;
import org.example.yogabusinessmanagementweb.common.entities.Teacher;

import java.math.BigDecimal;
import java.util.List;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class CourseResponsePageDetail {
    Long id;
    String name;
    String instruction;
    String description;
    String duration;
    String imagePath;
    int level;
    String videoPath;
    BigDecimal price;
    List<SectionResponsePageDetail> sections;
    Teacher teacher;
}
