package org.example.yogabusinessmanagementweb.repositories;

import org.example.yogabusinessmanagementweb.common.entities.Address;
import org.example.yogabusinessmanagementweb.common.entities.LectureProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LectureProgressRepository extends JpaRepository<LectureProgress, Long> {
    Optional<LectureProgress> findById(Long id);
}
