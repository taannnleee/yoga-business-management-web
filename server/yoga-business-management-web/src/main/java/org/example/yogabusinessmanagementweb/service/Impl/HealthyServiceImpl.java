package org.example.yogabusinessmanagementweb.service.Impl;

import org.example.yogabusinessmanagementweb.common.entities.User;
import org.example.yogabusinessmanagementweb.repositories.UserRepository;
import org.example.yogabusinessmanagementweb.dto.workout.mapper.HealthyInfoMapper;
import org.example.yogabusinessmanagementweb.dto.workout.user.HealthyInfoDto;
import org.example.yogabusinessmanagementweb.common.entities.workout.HealthyInfo;
import org.example.yogabusinessmanagementweb.common.entities.workout.WeightPlan;
import org.example.yogabusinessmanagementweb.exception.BadRequestException;
import org.example.yogabusinessmanagementweb.repositories.HealthyInfoRepository;
import org.example.yogabusinessmanagementweb.repositories.WeightPlanRepository;
import org.example.yogabusinessmanagementweb.service.HealthyService;
import org.example.yogabusinessmanagementweb.common.util.HealthyUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.util.List;

@Service
public class HealthyServiceImpl implements HealthyService {
    @Autowired
    private HealthyInfoRepository healthyInfoRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    private WeightPlanRepository weightPlanRepository;

    @Override
    public void createWeightPlanData() {
        if (weightPlanRepository.count() > 0) {
            return;
        }
        String[] weightPlanNames = {
                "Extreme Weight Loss",
                "Weight Loss",
                "Mild Weight Loss",
                "Maintain Weight",
                "Mild Weight Gain",
                "Weight Gain",
                "Extreme Weight Gain"
        };
        String[] weightPlanDescriptions = {
                "This plan is for those who want to lose weight quickly.",
                "This plan is for those who want to lose weight.",
                "This plan is for those who want to lose weight slowly.",
                "This plan is for those who want to maintain their weight.",
                "This plan is for those who want to gain weight slowly.",
                "This plan is for those who want to gain weight.",
                "This plan is for those who want to gain weight quickly."
        };

        for (int i = 0; i < weightPlanNames.length; i++) {
            WeightPlan weightPlan = WeightPlan.builder()
                    .name(weightPlanNames[i])
                    .description(weightPlanDescriptions[i])
                    .build();
            weightPlanRepository.save(weightPlan);
        }
    }

    @Override
    public HealthyInfoDto getHealthyInfo(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> BadRequestException.message("User not found"));
        HealthyInfo healthyInfo = user.getHealthyInfo();
        int age = LocalDate.now().getYear() ;
//                - user.getBirthday().getYear();
        if (healthyInfo == null) {
            healthyInfo = HealthyInfo.builder()
                    .user(user)
                    .age(age)
                    .build();
            healthyInfoRepository.save(healthyInfo);
        }

        if (age != healthyInfo.getAge()) {
            healthyInfo.setAge(age);

            Double bmi = HealthyUtils.calculateBmi(healthyInfo.getWeight(),
                    healthyInfo.getHeight());
            healthyInfo.setBmi(bmi);

            Double bmr = HealthyUtils.calculateBmr(healthyInfo.getWeight(),
                    healthyInfo.getHeight(), age, healthyInfo.isMale());
            healthyInfo.setBmr(bmr);

            healthyInfoRepository.save(healthyInfo);
        }

        return HealthyInfoMapper.INSTANCE
                .toHealthyInfoDto(healthyInfo);
    }

    @Override
    public HealthyInfoDto updateHealthyInfo(String email, HealthyInfoDto healthyInfoDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> BadRequestException.message("User not found"));
        HealthyInfo healthyInfoRequest = HealthyInfoMapper.INSTANCE
                .toHealthyInfo(healthyInfoDto);

        HealthyInfo healthyInfo = user.getHealthyInfo();
        if (healthyInfo == null) {
            healthyInfo = new HealthyInfo();
            healthyInfo.setUser(user);
        }
        WeightPlan weightPlan = weightPlanRepository.findById(healthyInfoRequest
                        .getWeightPlan().getId())
                .orElseThrow(() -> BadRequestException.message("Weight plan not found"));
        healthyInfo.setWeightPlan(weightPlan);
        healthyInfo.setWeight(healthyInfoRequest.getWeight());
        healthyInfo.setHeight(healthyInfoRequest.getHeight());
        healthyInfo.setActivityLevel(healthyInfoRequest.getActivityLevel());
        healthyInfo.setMealPerDay(healthyInfoRequest.getMealPerDay());
        healthyInfo.setMale(healthyInfoRequest.isMale());

        int age = LocalDate.now().getYear() ;
//                - user.getBirthday().getYear();
        healthyInfo.setAge(age);

        Double bmi = HealthyUtils.calculateBmi(healthyInfo.getWeight(),
                healthyInfo.getHeight());
        healthyInfo.setBmi(bmi);

        Double bmr = HealthyUtils.calculateBmr(healthyInfo.getWeight(),
                healthyInfo.getHeight(), age, healthyInfo.isMale());
        healthyInfo.setBmr(bmr);

        return HealthyInfoMapper.INSTANCE
                .toHealthyInfoDto(healthyInfoRepository.save(healthyInfo));
    }

    @Override
    public List<WeightPlan> getAllWeightPlan() {
        return weightPlanRepository.findAll();
    }
}
