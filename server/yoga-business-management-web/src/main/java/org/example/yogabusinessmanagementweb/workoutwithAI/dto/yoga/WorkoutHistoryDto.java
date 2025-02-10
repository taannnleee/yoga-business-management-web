package org.example.yogabusinessmanagementweb.workoutwithAI.dto.yoga;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutHistoryDto {
    private Long id;
    private YogaDto yogaWorkout;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss dd/MM/yyyy")
    @DateTimeFormat(pattern = "HH:mm:ss dd/MM/yyyy")
    private LocalDateTime startTime;
    private boolean isDone;
}
