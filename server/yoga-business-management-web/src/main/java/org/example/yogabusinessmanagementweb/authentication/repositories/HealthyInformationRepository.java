package org.example.yogabusinessmanagementweb.authentication.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HealthyInformationRepository extends JpaRepository<HealthyInformationRepository, Integer> {
}
