package org.example.yogabusinessmanagementweb.workoutwithAI.repository;


import org.example.yogabusinessmanagementweb.workoutwithAI.entity.UserWorkout;
import org.example.yogabusinessmanagementweb.workoutwithAI.entity.Workshop;
import org.example.yogabusinessmanagementweb.workoutwithAI.entity.WorkshopParticipant;
import org.example.yogabusinessmanagementweb.workoutwithAI.entity.key.WorkshopParticipantKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkshopParticipantRepository extends JpaRepository<WorkshopParticipant, WorkshopParticipantKey> {

    boolean existsById_UserAndId_Workshop(UserWorkout id_user, Workshop id_workshop);

    List<WorkshopParticipant> findAllById_Workshop_Id(Long id);

    List<WorkshopParticipant> findAllById_Workshop_IdAndSentFalse(Long id);
}
