package org.example.yogabusinessmanagementweb.workoutwithAI.entity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import lombok.*;
import org.example.yogabusinessmanagementweb.workoutwithAI.entity.key.WorkshopParticipantKey;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity(name = "workshops_participants")
public class WorkshopParticipant {
    @EmbeddedId
    private WorkshopParticipantKey id;

    private boolean sent;
}
