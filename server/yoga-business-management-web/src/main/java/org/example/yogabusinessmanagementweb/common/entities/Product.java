package org.example.yogabusinessmanagementweb.common.entities;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "Product")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter

public class Product extends AbstractEntity<Long> implements Serializable {

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "product_detail_id")
    private ProductDetail productDetail;

    @ManyToOne()
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "status")
    private String status;

}
