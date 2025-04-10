package org.example.yogabusinessmanagementweb.workoutwithAI.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.yogabusinessmanagementweb.workoutwithAI.entity.common.BaseEntity;

import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity(name = "posts")
public class Post extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @ManyToOne
    @JoinColumn(name = "author_id", referencedColumnName = "id")
    private UserWorkout author;

    private String content;

    private String imageUrl;

    // many posts can have many users likes
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "posts_likes", joinColumns =
    @JoinColumn(name = "post_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "user_id",
                    referencedColumnName = "id")
    )
    private List<UserWorkout> likes;
}
