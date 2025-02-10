package org.example.yogabusinessmanagementweb.workoutwithAI.dto.yoga;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.BaseDto;

@Data
@Setter
@Getter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class YogaDto extends BaseDto {
    private Long id;

    private String name;

    private String description;

    private String imageUrl;

    private String videoUrl;

    private Integer level;

    private Double point;

    private Integer duration;
    private String instruction;
}
