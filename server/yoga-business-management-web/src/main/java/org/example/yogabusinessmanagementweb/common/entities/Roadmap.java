package org.example.yogabusinessmanagementweb.common.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "Goal")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class Goal extends AbstractEntity<Long> implements Serializable {
    String name;        // Ví dụ: "Giảm cân", "Dẻo dai", "Thư giãn"
    String description;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "personalized_roadmaps_id")
    List<PersonalizedRoadmap> personalizedRoadmaps;

}
