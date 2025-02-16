package org.example.yogabusinessmanagementweb.workoutwithAI.dto.mapper;

import org.example.yogabusinessmanagementweb.workoutwithAI.dto.yoga.YogaDto;
import org.example.yogabusinessmanagementweb.workoutwithAI.entity.YogaWorkout;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface YogaMapper {
    static final YogaMapper INSTANCE = Mappers.getMapper(YogaMapper.class);

    // YogaDto to Yoga
    YogaWorkout toYoga(YogaDto yogaDto);
    // Yoga to YogaDto
    YogaDto toYogaDto(YogaWorkout yoga);

    // List<YogaDto> to List<Yoga>
    List<YogaWorkout> toYogaList(List<YogaDto> yogaDtos);
    // List<Yoga> to List<YogaDto>
    List<YogaDto> toYogaDtoList(List<YogaWorkout> yogas);
}
