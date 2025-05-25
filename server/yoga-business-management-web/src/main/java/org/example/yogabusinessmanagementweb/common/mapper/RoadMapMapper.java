package org.example.yogabusinessmanagementweb.common.mapper;

import org.example.yogabusinessmanagementweb.common.entities.Roadmap;
import org.example.yogabusinessmanagementweb.common.entities.TopicRoadmap;
import org.example.yogabusinessmanagementweb.dto.response.roadmap.RoadmapResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface RoadMapMapper {
    @Mapping(target = "topicRoadmapsResponse", source = "topicRoadmaps")
    RoadmapResponse toRoadMapCreationRequest(Roadmap roadmap);

}
