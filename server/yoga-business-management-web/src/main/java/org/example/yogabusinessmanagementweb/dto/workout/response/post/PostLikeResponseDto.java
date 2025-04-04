package org.example.yogabusinessmanagementweb.dto.workout.response.post;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class PostLikeResponseDto {
    private Long postId;
    private Long totalLike;
}
