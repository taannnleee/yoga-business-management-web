package org.example.yogabusinessmanagementweb.common.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.Enum.EStatusOrder;

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

    @Column(name = "quantity")
    int quantity;

    @OneToOne()
    @JoinColumn(name = "rating_id")
    Rating rating;

    @Column(name = "order_status")
    @Enumerated(EnumType.STRING) // Store enum as a string in the database
    EStatusOrder orderStatus;

    @Column(name = "total_price")
    Long totalPrice;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    Product product;

}
