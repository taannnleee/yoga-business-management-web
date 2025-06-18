package org.example.yogabusinessmanagementweb.dto.request.roadmap;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.List;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class RoadmapRequest {
    String title;
    String description;
    List<TopicRoadmapRequest> topicRoadmaps;

}
