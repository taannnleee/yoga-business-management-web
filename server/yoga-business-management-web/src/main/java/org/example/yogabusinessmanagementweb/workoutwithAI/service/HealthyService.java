package org.example.yogabusinessmanagementweb.workoutwithAI.service;

import org.example.yogabusinessmanagementweb.workoutwithAI.dto.user.HealthyInfoDto;
import org.example.yogabusinessmanagementweb.workoutwithAI.entity.WeightPlan;

import java.util.List;

public interface HealthyService {
    void createWeightPlanData();

    HealthyInfoDto getHealthyInfo(String email);

    HealthyInfoDto updateHealthyInfo(String email, HealthyInfoDto healthyInfoDto);

    List<WeightPlan> getAllWeightPlan();
}
