package org.example.yogabusinessmanagementweb.common.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.Enum.EStatus;

import java.io.Serializable;
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
    @Column(name = "order_date")
    Date orderDate;

    @Column(name = "deliveryDate")
    Date deliveryDate;

    @Column(name = "total_price")
    Long totalPrice;

    @Column(name = "total_item")
    int totalItem;

    @Column(name = "order_status")
    EStatus orderStatus    ;

    @ManyToOne()
    @JoinColumn(name = "user_id")
    User user;

    @OneToMany(mappedBy = "order")
    List<OrderItem> orderItems;

    @OneToOne()
    @JoinColumn(name = "address_id")
    Address address;

}
