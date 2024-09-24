package org.example.yogabusinessmanagementweb.common.entities;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.print.attribute.standard.Media;
import java.io.Serializable;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "HealthyInformation")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class HealthyInformation extends AbstractEntity<Long>  implements Serializable {
    @Column(name = "age")
    int age;

    @Column(name = "bmi")
    Double bmi;

    @Column(name = "bmr")
    Double bmr;

    @Column(name = "weight")
    Double weight;

    @Column(name = "height")
    Double height;

    @Column(name = "meal_per_day")
    int mealPerDay;

    @OneToOne()
    @JoinColumn(name = "user_id")
    User user;

    @OneToOne(mappedBy = "healthyInformation")
    WeighPlan weighPlan;

}
