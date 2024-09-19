package org.example.yogabusinessmanagementweb.common.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Table(name = "ProductDetail")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter

public class ProductDetail extends AbstractEntity<Long> implements Serializable {

    @Column(name = "name")
    private String name;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "decription")
    private String decription;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "material")
    private String material;

    @Column(name = "dimensions")
    private String dimensions;

    @Column(name = "thickness")
    private String thickness;

    @Column(name = "weight")
    private String weight;

    @Column(name = "color")
    private String color;


    @OneToOne(mappedBy = "productDetail")
    @JsonIgnore
    private Product product;


}
