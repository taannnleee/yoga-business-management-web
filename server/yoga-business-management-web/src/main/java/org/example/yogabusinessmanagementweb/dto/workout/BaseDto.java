package org.example.yogabusinessmanagementweb.dto.workout;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Data
@SuperBuilder
@NoArgsConstructor
public class BaseDto {
    private LocalDateTime createdDate;

    private LocalDateTime updatedDate;
}
