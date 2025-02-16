package org.example.yogabusinessmanagementweb.workoutwithAI.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.yogabusinessmanagementweb.workoutwithAI.entity.common.BaseEntity;

import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity(name = "yoga_workouts")
public class YogaWorkout extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private String imageUrl;

    private String videoUrl;

    private Integer level;

    private Double point;

    private Integer duration; //second

    @Column(name = "instruction", columnDefinition = "TEXT")
    private String instruction;

    @OneToMany(mappedBy = "yogaWorkout", fetch = FetchType.LAZY)
    private List<WorkoutHistory> workoutHistories;
}
