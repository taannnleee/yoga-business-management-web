package org.example.yogabusinessmanagementweb.workoutwithAI.dto.request.post;

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
