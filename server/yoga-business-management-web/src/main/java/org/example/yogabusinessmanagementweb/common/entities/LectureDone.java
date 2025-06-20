package org.example.yogabusinessmanagementweb.common.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "LectureDone")
@NoArgsConstructor

@AllArgsConstructor
@Builder
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LectureDone extends AbstractEntity<Long>{
    @ManyToOne
    @JoinColumn(name = "lecture_id")
    Lectures lectures;

    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;
}
