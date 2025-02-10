package org.example.yogabusinessmanagementweb.workoutwithAI.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity(name = "verify_code")
public class VerifyCode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserWorkout user;

    private String code;

    @ColumnDefault("false")
    private boolean isUsed;

    private LocalDateTime expiredAt;
}
