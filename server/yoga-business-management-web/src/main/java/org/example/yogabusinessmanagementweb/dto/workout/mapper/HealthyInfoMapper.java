package org.example.yogabusinessmanagementweb.dto.workout.mapper;

import org.example.yogabusinessmanagementweb.dto.workout.user.HealthyInfoDto;
import org.example.yogabusinessmanagementweb.common.entities.workout.HealthyInfo;
import org.mapstruct.Mapper;

@Mapper
public interface HealthyInfoMapper {
    HealthyInfoMapper INSTANCE = org.mapstruct.factory.Mappers.getMapper(HealthyInfoMapper.class);

    HealthyInfo toHealthyInfo(HealthyInfoDto healthyInfoDto);

    HealthyInfoDto toHealthyInfoDto(HealthyInfo healthyInfo);
}
