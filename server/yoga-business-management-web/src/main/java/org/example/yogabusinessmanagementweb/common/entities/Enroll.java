package org.example.yogabusinessmanagementweb.common.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Entity
@Table(name = "Enroll")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter

@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class Enroll   extends AbstractEntity<Long> implements Serializable {
    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;

    @ManyToOne
    @JoinColumn(name = "course_id")
    Courses course;
}
