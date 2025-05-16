package org.example.yogabusinessmanagementweb.common.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "membership_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MembershipType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // Ví dụ: "Đồng", "Bạc", "Vàng"

    private String description;

    private BigDecimal price; // Giá nếu cần

    private int durationInDays; // Ví dụ: 30 ngày

    private String url;
}