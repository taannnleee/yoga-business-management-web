package org.example.yogabusinessmanagementweb.common.entities;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "Wishlist")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class Wishlist  extends AbstractEntity<Long> implements Serializable {
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    User user;


    @OneToMany(mappedBy = "wishlist")
    List<Product> productList;
}
