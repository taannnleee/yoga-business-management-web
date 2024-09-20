package org.example.yogabusinessmanagementweb.common.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.*;

import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "ProductDetail")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Promotion  extends AbstractEntity<Long> implements Serializable {
    private Date endDate;
    private Date startDate;
    private int percent;

    @OneToOne(mappedBy = "promotion")
    private Product product;
}
