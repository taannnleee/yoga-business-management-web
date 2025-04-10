package org.example.yogabusinessmanagementweb.workoutwithAI.entity.key;


import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.yogabusinessmanagementweb.workoutwithAI.entity.UserWorkout;
import org.example.yogabusinessmanagementweb.workoutwithAI.entity.Workshop;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkshopParticipantKey implements Serializable {
    @ManyToOne(fetch = jakarta.persistence.FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserWorkout user;
    @ManyToOne(fetch = jakarta.persistence.FetchType.EAGER)
    @JoinColumn(name = "workshop_id", referencedColumnName = "id")
    private Workshop workshop;
}
