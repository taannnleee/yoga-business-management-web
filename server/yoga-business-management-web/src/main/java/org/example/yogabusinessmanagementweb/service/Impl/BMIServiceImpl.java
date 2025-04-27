package org.example.yogabusinessmanagementweb.service.Impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.dto.request.bmi.PersonIn;
import org.example.yogabusinessmanagementweb.dto.response.bmi.BMIOut;
import org.example.yogabusinessmanagementweb.service.BMIService;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class BMIServiceImpl implements BMIService {

    @Override
    public BMIOut calculateCalories(PersonIn personIn) {
        float bmi = calculateBmi(personIn);
        List<Map<String, Object>> calories = generateCaloriesPlans(personIn);
        String category;
        String color;
        if (bmi < 18.5) {
            category = "Underweight";
            color = "Red";
        } else if (bmi < 25) {
            category = "Normal";
            color = "Green";
        } else if (bmi < 30) {
            category = "Overweight";
            color = "Yellow";
        } else {
            category = "Obesity";
            color = "Red";
        }
        BMIOut bmiOut = new BMIOut();
        bmiOut.setBmi(bmi);
        bmiOut.setCategory(category);
        bmiOut.setColor(color);
        bmiOut.setCalories(calories);
        return bmiOut;
    }

    @Override
    public Object recommendMeals(PersonIn personIn) {
        // TODO: implement logic giống generate_recommendations()
        return Collections.emptyList();
    }

    private float calculateBmi(PersonIn person) {
        return Math.round((person.getWeight() / Math.pow(person.getHeight() / 100, 2)) * 100.0) / 100.0f;
    }

    private List<Map<String, Object>> generateCaloriesPlans(PersonIn person) {
        List<Map<String, Object>> result = new ArrayList<>();
        float maintainCalories = calculateMaintainCalories(person);
        String[] plans = {"Maintain weight", "Mild weight loss", "Weight loss", "Extreme weight loss"};
        float[] weights = {1, 0.9f, 0.8f, 0.6f};
        String[] losses = {"-0 kg/week", "-0.25 kg/week", "-0.5 kg/week", "-1 kg/week"};

        for (int i = 0; i < plans.length; i++) {
            Map<String, Object> plan = new HashMap<>();
            plan.put("calories", Math.round(weights[i] * maintainCalories * 100.0) / 100.0);
            plan.put("plan", plans[i]);
            plan.put("weight_loss", losses[i]);
            result.add(plan);
        }
        return result;
    }

    private float calculateMaintainCalories(PersonIn person) {
        float bmr;
        if ("Male".equalsIgnoreCase(person.getGender())) {
            bmr = 10 * person.getWeight() + 6.25f * person.getHeight() - 5 * person.getAge() + 5;
        } else {
            bmr = 10 * person.getWeight() + 6.25f * person.getHeight() - 5 * person.getAge() - 161;
        }

        Map<String, Float> activityFactors = Map.of(
                "Little/no exercise", 1.2f,
                "Light exercise", 1.375f,
                "Moderate exercise (3-5 days/wk)", 1.55f,
                "Very active (6-7 days/wk)", 1.725f,
                "Extra active (very active & physical job)", 1.9f
        );

        return bmr * activityFactors.getOrDefault(person.getActivity(), 1.2f);
    }
}
