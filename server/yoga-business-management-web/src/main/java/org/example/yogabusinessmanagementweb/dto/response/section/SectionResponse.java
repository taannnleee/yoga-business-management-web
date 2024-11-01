package org.example.yogabusinessmanagementweb.dto.response.section;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.entities.Teacher;
import org.example.yogabusinessmanagementweb.common.entities.Topic;

import java.math.BigDecimal;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class SectionResponse {
    Long id;
    String title;
}
