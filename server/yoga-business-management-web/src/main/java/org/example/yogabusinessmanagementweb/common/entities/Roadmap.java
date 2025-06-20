package org.example.yogabusinessmanagementweb.common.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "Roadmap")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class Roadmap extends AbstractEntity<Long> implements Serializable {
    String title;        // Ví dụ: "Giảm cân", "Dẻo dai", "Thư giãn"
    String description;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "topic_roadmap_id")
    List<TopicRoadmap> topicRoadmaps;
}
