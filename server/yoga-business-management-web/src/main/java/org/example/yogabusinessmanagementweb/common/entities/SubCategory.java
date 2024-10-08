package org.example.yogabusinessmanagementweb.common.entities;



import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.Enum.EStatus;

import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "SubCategory")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class SubCategory extends AbstractEntity<Long> implements Serializable  {
    //SubCategoryId đã extend
    @Column(name = "name")
    String name;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    Category Category;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    EStatus status = EStatus.ACTIVE;

}


