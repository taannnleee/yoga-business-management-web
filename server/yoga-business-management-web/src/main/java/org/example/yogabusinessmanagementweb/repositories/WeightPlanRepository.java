package org.example.yogabusinessmanagementweb.repositories;

import org.example.yogabusinessmanagementweb.common.entities.workout.WeightPlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WeightPlanRepository extends JpaRepository<WeightPlan, Long> {
}
