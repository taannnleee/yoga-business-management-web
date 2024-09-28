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
    @Column(name = "color")
    String color;
    @Column(name = "size")
    String size;
    @Column(name = "price")
    BigDecimal price;
    @Column(name = "code")
    String code;
    @Column(name = "brand")
    String brand;
    @Column(name = "description")
    String description;

    @OneToOne()
//    @JsonIgnore
    Product product;


}
