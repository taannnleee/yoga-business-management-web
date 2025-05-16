package org.example.yogabusinessmanagementweb.dto.request.lecture;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;
@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class LectureProductAdDTO {
     Long lectureId;
     List<Long> productIds;
     int startSecond;
     int endSecond;
}
