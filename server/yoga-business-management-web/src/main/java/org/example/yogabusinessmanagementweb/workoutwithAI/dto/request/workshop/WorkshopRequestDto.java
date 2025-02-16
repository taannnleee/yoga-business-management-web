package org.example.yogabusinessmanagementweb.workoutwithAI.dto.request.workshop;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WorkshopRequestDto{
    @NotBlank(message = "Name is required")
    private String name;
    private String description;
    @NotNull(message = "Address is required")
    private String address;
    private String imageUrl;
    @NotNull(message = "Category is required")
    private String category;
    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;
    @NotNull(message = "End time is required")
    private LocalDateTime endTime;
}
