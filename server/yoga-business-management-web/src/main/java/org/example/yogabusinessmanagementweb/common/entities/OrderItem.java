package org.example.yogabusinessmanagementweb.common.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.Enum.EStatus;

import java.io.Serializable;

@Entity
@Table(name = "OrderItem")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class OrderItem extends AbstractEntity<Long> implements Serializable {
    @Column(name = "title")
    String title;

    @Column(name = "quanlity")
    int quanlity;

    @Column(name = "total_price")
    Long totalPrice;

    @Column(name = "order_status")
    EStatus orderStatus;

    @ManyToOne
    @JoinColumn(name = "order_id")
    Order order;

    @OneToOne()
    @JoinColumn(name = "rating_id")
    Rating rating;
}
