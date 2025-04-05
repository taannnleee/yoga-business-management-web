package org.example.yogabusinessmanagementweb.dto.workout.request.post;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class PostLikeRequestDto {
    private Long postId;
}
