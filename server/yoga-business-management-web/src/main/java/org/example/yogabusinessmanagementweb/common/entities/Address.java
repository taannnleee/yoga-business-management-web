package org.example.yogabusinessmanagementweb.common.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "Address")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class Address extends AbstractEntity<Long> {
    String name;
    String street;
    String city;
    String state;

    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;

    @OneToOne(mappedBy = "address")
    Order order;
}
