package org.example.yogabusinessmanagementweb.common.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "LectureProgress")
@NoArgsConstructor

@AllArgsConstructor
@Builder
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LectureProgress extends AbstractEntity<Long> {
    @ManyToOne
    @JoinColumn(name = "lecture_id")
    Lectures lectures;

    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;

    LocalDateTime completedAt;
}
