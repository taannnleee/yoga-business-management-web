package org.example.yogabusinessmanagementweb.workoutwithAI.dto.mapper;

import org.example.yogabusinessmanagementweb.workoutwithAI.dto.yoga.WorkoutHistoryDto;
import org.example.yogabusinessmanagementweb.workoutwithAI.entity.WorkoutHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface YogaHistoryMapper {
    YogaHistoryMapper INSTANCE = Mappers.getMapper(YogaHistoryMapper.class);

    // YogaHistoryResponse to YogaHistory
    @Mapping(source = "done", target = "isDone")
    WorkoutHistory toYogaHistory(WorkoutHistoryDto yogaHistoryDto);
    // YogaHistory to YogaHistoryResponse
    @Mapping(source = "done", target = "isDone")
    WorkoutHistoryDto toYogaHistoryDto(WorkoutHistory yogaHistory);

    // List<YogaHistoryResponse> to List<YogaHistory>
    List<WorkoutHistory> toYogaHistoryList(List<WorkoutHistoryDto> yogaHistoryDtos);
    // List<YogaHistory> to List<YogaHistoryResponse>
    List<WorkoutHistoryDto> toYogaHistoryDtoList(List<WorkoutHistory> yogaHistories);

}
