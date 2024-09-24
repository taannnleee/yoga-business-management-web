package org.example.yogabusinessmanagementweb.common.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "Product")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)

public class Product extends AbstractEntity<Long> implements Serializable {

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "product_detail_id")
    ProductDetail productDetail;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    Category category;

    @Column(name = "status")
    String status;

    @OneToOne(mappedBy = "product")
    CartItem cartItem;

    @ManyToOne()
    @JoinColumn(name = "wishlist_id")
    Wishlist wishlist;

    @OneToOne
    @JoinColumn(name = "promotion_id")
    Promotion promotion;
}
