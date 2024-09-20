package org.example.yogabusinessmanagementweb.common.entities;


import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "Wishlist")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Wishlist  extends AbstractEntity<Long> implements Serializable {
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private User user;


    @OneToMany(mappedBy = "wishlist")
    private List<Product> productList;
}
