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
    int totalItem;
    Long totalPrice;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    Cart cart;

    @OneToOne
    @JoinColumn(name = "cartitem_id")
    Product product;

}
