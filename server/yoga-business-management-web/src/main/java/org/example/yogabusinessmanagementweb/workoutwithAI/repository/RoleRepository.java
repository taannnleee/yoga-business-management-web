package org.example.yogabusinessmanagementweb.workoutwithAI.repository;

import org.example.yogabusinessmanagementweb.workoutwithAI.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(String name);
}
