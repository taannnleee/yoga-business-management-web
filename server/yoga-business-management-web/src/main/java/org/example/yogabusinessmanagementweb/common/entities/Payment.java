package org.example.yogabusinessmanagementweb.common.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "Payment")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class Payment extends AbstractEntity<Long> implements Serializable {
    @Column(name = "name_method")
    String nameMethod;

    @OneToOne
    @JoinColumn(name = "order_id")
    Order order;
}
