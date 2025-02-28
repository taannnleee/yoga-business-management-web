package org.example.yogabusinessmanagementweb.workoutwithAI.api;

import lombok.RequiredArgsConstructor;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.ResponseDto;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.yoga.WorkoutHistoryDto;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.yoga.YogaDto;
import org.example.yogabusinessmanagementweb.workoutwithAI.service.YogaService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/yoga-workouts")
@RequiredArgsConstructor
//@SecurityRequirement(name = "bearerAuth")
public class YogaController {
    private final YogaService yogaService;

    @PostMapping("/upsert")
    public ResponseDto<YogaDto> upsertYogaWorkout(@RequestBody YogaDto yogaDto) {
        return ResponseDto.success(yogaService.upsert(yogaDto));
    }
    
    @GetMapping("/{id}")
    public ResponseDto<YogaDto> getYogaWorkout(@PathVariable Long id) {
        return ResponseDto.success(yogaService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseDto<Void> deleteYogaWorkout(@PathVariable Long id) {
        yogaService.delete(id);
        return ResponseDto.success(null);
    }

    @GetMapping
    public ResponseDto<List<YogaDto>> getAllYogaWorkouts() {
        return ResponseDto.success(yogaService.findAll());
    }

    @GetMapping("/history")
    public ResponseDto<List<WorkoutHistoryDto>> getWorkoutHistory(Authentication authentication) {
        return ResponseDto.success(
                yogaService
                        .getWorkoutHistoryFromEmail(authentication.getName()));
    }

    @PostMapping("/history/upsert")
    public ResponseDto<WorkoutHistoryDto> upsertWorkoutHistory(@RequestBody WorkoutHistoryDto workoutHistoryDto,
                                                               Authentication authentication) {
        return ResponseDto.success(yogaService.upsertWorkoutHistory(workoutHistoryDto, authentication.getName()));
    }
}
