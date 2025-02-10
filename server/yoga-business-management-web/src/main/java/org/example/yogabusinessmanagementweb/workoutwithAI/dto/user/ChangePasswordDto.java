package org.example.yogabusinessmanagementweb.workoutwithAI.dto.user;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordDto {
    @NotNull(message = "Old password is required")
    private String oldPassword;
    @NotNull(message = "New password is required")
    private String newPassword;
    @NotNull(message = "Confirm password is required")
    private String confirmPassword;
}
