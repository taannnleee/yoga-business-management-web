package org.example.yogabusinessmanagementweb.service;

import org.example.yogabusinessmanagementweb.dto.workout.user.HealthyInfoDto;
import org.example.yogabusinessmanagementweb.common.entities.workout.WeightPlan;

import java.util.List;

public interface HealthyService {
    void createWeightPlanData();

    HealthyInfoDto getHealthyInfo(String email);

    HealthyInfoDto updateHealthyInfo(String email, HealthyInfoDto healthyInfoDto);

    List<WeightPlan> getAllWeightPlan();
}
