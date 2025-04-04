package org.example.yogabusinessmanagementweb.dto.workout.mapper;

import org.example.yogabusinessmanagementweb.common.entities.User;
import org.example.yogabusinessmanagementweb.dto.workout.user.HealthyInfoDto;
import org.example.yogabusinessmanagementweb.dto.workout.user.UserResponse;
import org.example.yogabusinessmanagementweb.common.entities.workout.HealthyInfo;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface UserMapper
{
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);
    UserResponse toDto(User user);

    User toEntity(UserResponse userResponse);

    HealthyInfo toEntity(HealthyInfoDto healthyInfoDto);

    HealthyInfoDto toDto(HealthyInfo healthyInfo);
}
