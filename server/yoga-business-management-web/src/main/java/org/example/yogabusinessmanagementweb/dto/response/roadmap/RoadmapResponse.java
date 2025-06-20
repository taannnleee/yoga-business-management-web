package org.example.yogabusinessmanagementweb.dto.response.roadmap;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.entities.TopicRoadMap_Course;
import org.example.yogabusinessmanagementweb.common.entities.TopicRoadmap;

import java.util.List;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class RoadmapResponse {
    Long id;
    String title;        // Ví dụ: "Giảm cân", "Dẻo dai", "Thư giãn"
    String description;
    List<TopicRoadMapResponse> topicRoadmapsResponse;

}
