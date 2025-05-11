package org.example.yogabusinessmanagementweb.repositories;

import org.example.yogabusinessmanagementweb.common.entities.LectureProductAd;
import org.example.yogabusinessmanagementweb.common.entities.Courses;
import org.example.yogabusinessmanagementweb.common.entities.Lectures;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LectureProductAdRepository extends JpaRepository<LectureProductAd, Long> {
    List<LectureProductAd> findByLecture(Lectures lecture);
}
