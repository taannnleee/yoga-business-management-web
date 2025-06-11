package org.example.yogabusinessmanagementweb.dto.response.course;

import jakarta.persistence.CascadeType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.entities.Lectures;
import org.example.yogabusinessmanagementweb.common.entities.Sections;

import java.math.BigDecimal;
import java.util.List;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class SectionResponsePageDetail {
    Long id;
    String title;

    List<LectureResponsePageDetail> lectures;
}
