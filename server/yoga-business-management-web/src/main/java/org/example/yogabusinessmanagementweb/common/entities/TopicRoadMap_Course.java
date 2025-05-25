package org.example.yogabusinessmanagementweb.common.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.dto.response.roadmap.TopicRoadMapResponse;

import java.math.BigDecimal;

@Entity
@Table(name = "TopicRoadMap_Course")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TopicRoadMap_Course extends AbstractEntity<Long>{
    @ManyToOne()
    @JoinColumn(name = "course_id")
    Courses course;

    @ManyToOne
    @JoinColumn(name = "topic_roadmap_id")
    TopicRoadmap topicRoadmap;
}
