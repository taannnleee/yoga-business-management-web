package org.example.yogabusinessmanagementweb.repositories;

import org.example.yogabusinessmanagementweb.common.entities.workout.YogaWorkout;
import org.springframework.data.jpa.repository.JpaRepository;

public interface YogaWorkoutRepository extends JpaRepository<YogaWorkout, Long> {
}
