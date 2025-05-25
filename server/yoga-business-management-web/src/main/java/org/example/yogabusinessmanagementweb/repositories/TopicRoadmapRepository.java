package org.example.yogabusinessmanagementweb.repositories;

import org.example.yogabusinessmanagementweb.common.entities.Address;
import org.example.yogabusinessmanagementweb.common.entities.TopicRoadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TopicRoadmapRepository extends JpaRepository<TopicRoadmap, Long> {
    List<TopicRoadmap> findAllById(Long id);
}
