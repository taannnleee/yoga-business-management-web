package org.example.yogabusinessmanagementweb.common.mapper;

import org.example.yogabusinessmanagementweb.common.entities.Roadmap;
import org.example.yogabusinessmanagementweb.dto.response.roadmap.RoadmapResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoadMapTopicMapper {
    RoadmapResponse toRoadMapCreationRequest(Roadmap roadmap);

}
