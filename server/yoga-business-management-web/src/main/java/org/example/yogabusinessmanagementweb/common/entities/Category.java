package org.example.yogabusinessmanagementweb.common.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "Category")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter

public class Category extends AbstractEntity<Long> implements Serializable  {

    @Column(name = "url_image")
    private String urlImage;

    @Column(name = "status")
    private String status;

    @Column(name = "category_name")
    private String categoryName;

    @OneToMany(mappedBy = "category",cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnore
    private List<Product> listproducts;


}

