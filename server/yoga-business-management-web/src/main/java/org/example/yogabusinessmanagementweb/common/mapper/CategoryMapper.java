package com.example.server.mapper;

import com.example.server.dto.request.trainingprogram.TrainingProgramCreationRequest;
import com.example.server.dto.request.trainingprogram.TrainingProgramUpdateRequest;
import com.example.server.dto.response.trainingprogram.TrainingProgramResponse;
import com.example.server.entity.Duration;
import com.example.server.entity.TrainingProgram;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface TrainingProgramMapper {
    TrainingProgram ToTrainingProgram (TrainingProgramCreationRequest request);
    default Float mapDurationToDays(Duration duration) {
        return duration != null ? duration.getDays() : null;
    }

//    @Mapping(target = "duration", source = "duration", qualifiedByName = "mapDurationToDays")
    @Mapping(target = "createdDate",source = "createdDate")
    @Mapping(target = "createdBy",source = "createdBy")
//    @Mapping(target = "modules",source = "modules")
    TrainingProgramResponse TrainingProgramToTrainingProgramResponse( TrainingProgram trainingProgram);
    void TrainingProgramUpdateRequestToTrainingProgram(TrainingProgramUpdateRequest request, @MappingTarget TrainingProgram trainingProgram);


//    @Mapping(target = "createdDate",source = "createdDate")
    List<TrainingProgramResponse> trainingProgramsToTrainingProgramsResponses(List<TrainingProgram> trainingPrograms);
}
