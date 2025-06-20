package org.example.yogabusinessmanagementweb.dto.response.course;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.entities.Sections;

import java.math.BigDecimal;
import java.util.List;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class LectureResponsePageDetail {
    Long id;
    String title;
    String content;
    String videoPath;
    String duration;//phút
    String image;
    Boolean isPublic;
    Boolean isDone;
}
