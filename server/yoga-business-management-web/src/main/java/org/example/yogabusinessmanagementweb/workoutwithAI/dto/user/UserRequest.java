package org.example.yogabusinessmanagementweb.workoutwithAI.dto.user;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.BaseDto;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest extends BaseDto {
    @NotNull(message = "Full Name is required")
    private String fullName;
    @Email(message = "Email is not valid")
    private String email;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    @Past(message = "Birthday must be in the past")
    private LocalDate birthday;
    private HealthyInfoDto healthyInfo;
}
