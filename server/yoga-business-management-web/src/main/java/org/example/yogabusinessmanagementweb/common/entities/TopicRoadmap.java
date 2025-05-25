package org.example.yogabusinessmanagementweb.common.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Entity
@Table(name = "PersonalizedRoadmap")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class PersonalizedLesson extends AbstractEntity<Long> implements Serializable {
    String title;

    @ManyToOne
    @JoinColumn(name = "course_id")
    Courses course;

    @ManyToOne
    @JoinColumn(name = "personalized_lesson_id")
    PersonalizedLesson personalized_lesson;
}
