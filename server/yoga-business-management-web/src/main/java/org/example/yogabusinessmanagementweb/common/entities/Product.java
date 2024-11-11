package org.example.yogabusinessmanagementweb.common.entities;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.entities.models.ProductVariants;

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

    @Column(name = "code")
    String code;
    @Column(name = "brand")
    String brand;
    @Column(name = "description", columnDefinition = "TEXT")
    String description;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "rating_id")
    List<Rating> ratings;


    // Thuộc tính mới để lưu danh sách variants dưới dạng JSON
    @Lob
    @Column(name = "variant_list")
    String variantList;
}
