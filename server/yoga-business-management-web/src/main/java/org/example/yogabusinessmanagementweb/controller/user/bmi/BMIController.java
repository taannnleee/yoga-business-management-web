package org.example.yogabusinessmanagementweb.controller.user.bmi;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.dto.request.bmi.PersonIn;
import org.example.yogabusinessmanagementweb.dto.response.ApiResponse;
import org.example.yogabusinessmanagementweb.dto.response.bmi.BMIOut;
import org.example.yogabusinessmanagementweb.service.BMIService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bmi")
@RequiredArgsConstructor
@Slf4j
public class BMIController {

    private final BMIService bmiService;

    @PostMapping("/calories")
    public ApiResponse<BMIOut> calculateCalories(@RequestBody PersonIn personIn) {
        BMIOut result = bmiService.calculateCalories(personIn);
        return new ApiResponse<>(HttpStatus.OK.value(), "Calculated BMI successfully", result);
    }

    @PostMapping("/recommend")
    public ApiResponse<?> recommendMeals(@RequestBody PersonIn personIn) {
        Object recommendations = bmiService.recommendMeals(personIn);
        return new ApiResponse<>(HttpStatus.OK.value(), "Recommended meals successfully", recommendations);
    }
}
