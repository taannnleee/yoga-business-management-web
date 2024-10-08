package org.example.yogabusinessmanagementweb.yoga.repositories;

import org.example.yogabusinessmanagementweb.common.entities.WeighPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WeighPlanRepository extends JpaRepository<WeighPlan, Long> {
}
