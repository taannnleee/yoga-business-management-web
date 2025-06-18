package org.example.yogabusinessmanagementweb.repositories;

import org.example.yogabusinessmanagementweb.common.entities.Roadmap;
import org.example.yogabusinessmanagementweb.common.entities.TopicRoadMap_Course;
import org.example.yogabusinessmanagementweb.common.entities.TopicRoadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TopicRoadmapCourseRepository extends JpaRepository<TopicRoadMap_Course, Long> {
    List<TopicRoadMap_Course> findAllByTopicRoadmap(TopicRoadmap topicRoadmap);
    void deleteByTopicRoadmap(TopicRoadmap topicRoadmap);
    void deleteAllByTopicRoadmap(TopicRoadmap topicRoadmap);
}
