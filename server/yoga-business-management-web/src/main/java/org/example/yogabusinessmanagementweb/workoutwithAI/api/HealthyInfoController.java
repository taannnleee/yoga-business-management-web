package org.example.yogabusinessmanagementweb.workoutwithAI.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.ResponseDto;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.user.HealthyInfoDto;
import org.example.yogabusinessmanagementweb.workoutwithAI.entity.WeightPlan;
import org.example.yogabusinessmanagementweb.workoutwithAI.service.HealthyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/healthiness")
@SecurityRequirement(name = "bearerAuth")
public class HealthyInfoController {
    @Autowired
    private HealthyService healthyService;

    @GetMapping("/info")
    public ResponseDto<HealthyInfoDto> getHealthyInfo(Authentication authentication) {
        String email = authentication.getName();
        return ResponseDto.success(healthyService.getHealthyInfo(email));
    }

    @PostMapping("/info")
    public ResponseDto<HealthyInfoDto> updateHealthyInfo(Authentication authentication,
                                                         @Valid
                                                         @RequestBody HealthyInfoDto healthyInfoDto) {
        String email = authentication.getName();
        return ResponseDto.success(healthyService.updateHealthyInfo(email, healthyInfoDto));
    }

    @GetMapping("/weight-plans")
    public ResponseDto<List<WeightPlan>> getAllWeightPlan() {
        return ResponseDto.success(healthyService.getAllWeightPlan());
    }
}
