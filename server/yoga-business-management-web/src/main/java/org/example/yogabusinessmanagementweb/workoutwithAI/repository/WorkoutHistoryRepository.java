package org.example.yogabusinessmanagementweb.workoutwithAI.repository;

import org.example.yogabusinessmanagementweb.workoutwithAI.entity.WorkoutHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkoutHistoryRepository extends JpaRepository<WorkoutHistory, Long> {
    List<WorkoutHistory> findByUserEmail(String email);
}
