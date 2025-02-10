package org.example.yogabusinessmanagementweb.workoutwithAI.repository;

import org.example.yogabusinessmanagementweb.workoutwithAI.entity.UserWorkout;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserWorkoutRepository extends JpaRepository<UserWorkout, Long> {
    Optional<UserWorkout> findByFullName(String fullName);

    Optional<UserWorkout> findByEmail(String email);

    boolean existsByEmail(String email);
}
