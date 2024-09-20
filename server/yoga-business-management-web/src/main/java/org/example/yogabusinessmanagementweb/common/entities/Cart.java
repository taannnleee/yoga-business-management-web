package org.example.yogabusinessmanagementweb.common.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "Cart")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Cart extends AbstractEntity<Long>{
    private int totalItem;
    private Long totalPrice;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "cart")
    private List<CartItem> cartItems;
}
