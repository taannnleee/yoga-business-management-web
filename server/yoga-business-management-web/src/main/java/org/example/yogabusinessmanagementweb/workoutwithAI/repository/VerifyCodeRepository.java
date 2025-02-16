package org.example.yogabusinessmanagementweb.workoutwithAI.repository;

import org.example.yogabusinessmanagementweb.workoutwithAI.entity.UserWorkout;
import org.example.yogabusinessmanagementweb.workoutwithAI.entity.VerifyCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerifyCodeRepository extends JpaRepository<VerifyCode, Long>{
    Optional<VerifyCode> findByUserAndCode(UserWorkout user, String code);
}
