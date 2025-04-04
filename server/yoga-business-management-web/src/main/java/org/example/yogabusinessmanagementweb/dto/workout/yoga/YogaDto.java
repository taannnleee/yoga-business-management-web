package org.example.yogabusinessmanagementweb.dto.workout.yoga;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.example.yogabusinessmanagementweb.dto.workout.BaseDto;

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
