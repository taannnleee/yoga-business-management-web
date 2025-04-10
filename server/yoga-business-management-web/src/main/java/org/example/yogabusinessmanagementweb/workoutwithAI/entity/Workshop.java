package org.example.yogabusinessmanagementweb.workoutwithAI.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.yogabusinessmanagementweb.workoutwithAI.entity.common.BaseEntity;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity(name = "workshops")
public class Workshop extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private String address;

    private String imageUrl;
    private String category;

    @ManyToOne // Many workshops can be created by one user
    @JoinColumn(name = "host_id", referencedColumnName = "id")
    private UserWorkout host;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "workshops_users", joinColumns =
    @JoinColumn(name = "workshop_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "participant_id",
                    referencedColumnName = "id")
    )
    private List<UserWorkout> participants;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private boolean cancelled;

    private boolean finished;
}
