package org.example.yogabusinessmanagementweb.workoutwithAI.dto.response.workshop;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JoinWorkshopResponseDto {
    private String workshopName;
    private long totalPeople;
}
