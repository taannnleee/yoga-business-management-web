package org.example.yogabusinessmanagementweb.common.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "Notification")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class Notification  extends AbstractEntity<Long>{

    @Column
    private String title; // Tiêu đề thông báo

    @Column
    private String message; // Nội dung thông báo

    @Column
    private Boolean isRead = false; // Trạng thái đã đọc hay chưa

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

}