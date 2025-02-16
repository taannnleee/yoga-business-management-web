package org.example.yogabusinessmanagementweb.workoutwithAI.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity(name = "weight_plans")
public class WeightPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;


    @JsonIgnore
    @JsonIgnoreProperties("weightPlan")
    @OneToMany(mappedBy = "weightPlan")
    private List<HealthyInfo> weightPlanDetails;
}
