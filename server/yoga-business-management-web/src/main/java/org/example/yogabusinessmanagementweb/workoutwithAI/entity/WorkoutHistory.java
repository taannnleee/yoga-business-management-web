package org.example.yogabusinessmanagementweb.workoutwithAI.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity(name = "workout_histories")
public class WorkoutHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserWorkout user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "yoga_workout_id", referencedColumnName = "id")
    private YogaWorkout yogaWorkout;

    private LocalDateTime startTime;

    private boolean isDone;
}
