package org.example.yogabusinessmanagementweb.common.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.Enum.EStatus;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "Orders")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class Order extends AbstractEntity<Long> implements Serializable {
    @Column(name = "deliveryDate")
    Date deliveryDate;
    @Column(name = "total_price")
    BigDecimal totalPrice;
    @Column(name = "total_item")
    int totalItem;
    @OneToOne()
    Payment payment;
    @Column(name = "order_date")
    Date orderDate;
    @ManyToOne()
    @JoinColumn(name = "user_id")
    User user;
    @OneToOne()
    @JoinColumn(name = "address_id")
    Address address;
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    List<OrderItem> orderItems;
}
