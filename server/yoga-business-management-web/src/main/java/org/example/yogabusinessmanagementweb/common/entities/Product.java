package org.example.yogabusinessmanagementweb.common.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.math.BigDecimal;
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
    @Column(name = "image_url")
    String imagePath;
    String status;

    @Column(name = "price")
    BigDecimal price;

    @Column(name = "title")
    String title;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "subCategory_id")
    SubCategory subCategory;

    @Column(name = "average_rating")
    Double averageRating = (double) 0;
}
