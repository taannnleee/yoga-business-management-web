package org.example.yogabusinessmanagementweb.authentication.repositories;

import org.example.yogabusinessmanagementweb.common.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface YogaWorkoutRepository extends JpaRepository<YogaWorkoutRepository, Long> {
}
