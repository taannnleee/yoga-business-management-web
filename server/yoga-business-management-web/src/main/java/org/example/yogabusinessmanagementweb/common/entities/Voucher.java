package org.example.yogabusinessmanagementweb.common.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.Enum.EDiscountType;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "Voucher")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class Voucher extends AbstractEntity<Long>  implements Serializable {
    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @Column(name = "discount", nullable = false)
    private Double discount; // Giá trị giảm giá, có thể là phần trăm hoặc số tiền

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false)
    private EDiscountType eDiscountType;// Loại giảm giá: phần trăm hoặc cố định

    @Column(name = "start_date")
    private Date startDate;

    @Column(name = "expiry_date")
    private Date expiryDate;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;
}
