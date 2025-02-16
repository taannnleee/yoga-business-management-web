package org.example.yogabusinessmanagementweb.workoutwithAI.dto.mapper;

import org.example.yogabusinessmanagementweb.workoutwithAI.dto.user.HealthyInfoDto;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.user.UserResponse;
import org.example.yogabusinessmanagementweb.workoutwithAI.entity.HealthyInfo;
import org.example.yogabusinessmanagementweb.workoutwithAI.entity.UserWorkout;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface UserMapper
{
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);
    UserResponse toDto(UserWorkout user);

    UserWorkout toEntity(UserResponse userResponse);

    HealthyInfo toEntity(HealthyInfoDto healthyInfoDto);

    HealthyInfoDto toDto(HealthyInfo healthyInfo);
}
