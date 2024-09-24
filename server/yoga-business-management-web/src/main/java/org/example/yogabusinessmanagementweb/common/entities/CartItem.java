package org.example.yogabusinessmanagementweb.common.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "CartItem")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class CartItem extends AbstractEntity<Long>{
    @OneToOne
    @JoinColumn(name = "product_id")
    Product product;
    int quantity;
    Long totalPrice;
}
