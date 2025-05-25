package org.example.yogabusinessmanagementweb.dto.request.roadmap;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class RoadmapResponse {
    Long id;
    String title;        // Ví dụ: "Giảm cân", "Dẻo dai", "Thư giãn"
    String description;
    List<Long> topicRoadmapIds;


}
