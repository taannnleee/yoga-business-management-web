package org.example.yogabusinessmanagementweb.common.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "TopicRoadmap")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class TopicRoadmap extends AbstractEntity<Long> implements Serializable {
    String title;

    @Column(columnDefinition = "TEXT")
    String content;
}
