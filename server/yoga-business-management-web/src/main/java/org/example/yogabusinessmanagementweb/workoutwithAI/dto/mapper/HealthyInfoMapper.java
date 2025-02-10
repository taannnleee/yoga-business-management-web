package org.example.yogabusinessmanagementweb.workoutwithAI.dto.mapper;

import org.example.yogabusinessmanagementweb.workoutwithAI.dto.user.HealthyInfoDto;
import org.example.yogabusinessmanagementweb.workoutwithAI.entity.HealthyInfo;
import org.mapstruct.Mapper;

@Mapper
public interface HealthyInfoMapper {
    HealthyInfoMapper INSTANCE = org.mapstruct.factory.Mappers.getMapper(HealthyInfoMapper.class);

    HealthyInfo toHealthyInfo(HealthyInfoDto healthyInfoDto);

    HealthyInfoDto toHealthyInfoDto(HealthyInfo healthyInfo);
}
