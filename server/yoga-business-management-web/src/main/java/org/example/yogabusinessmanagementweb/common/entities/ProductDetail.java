package org.example.yogabusinessmanagementweb.common.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "ProductDetail")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class ProductDetail extends AbstractEntity<Long> implements Serializable {

    @Column(name = "name")
    String name;

    @Column(name = "image_url")
    String imagePath;

    @Column(name = "decription")
    String decription;

    @Column(name = "price")
    BigDecimal price;

    @Column(name = "material")
    String material;

    @Column(name = "dimensions")
    String dimensions;

    @Column(name = "thickness")
    String thickness;

    @Column(name = "weight")
    String weight;

    @Column(name = "color")
    String color;


    @OneToOne(mappedBy = "productDetail")
//    @JsonIgnore
    Product product;


}
