package org.example.yogabusinessmanagementweb.workoutwithAI.repository;

import org.example.yogabusinessmanagementweb.workoutwithAI.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}
