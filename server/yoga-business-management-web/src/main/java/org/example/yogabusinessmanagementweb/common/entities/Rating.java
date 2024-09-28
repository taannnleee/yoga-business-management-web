package org.example.yogabusinessmanagementweb.common.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "Rating")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class Rating extends AbstractEntity<Long> implements Serializable {
    @Column(name = "rate_point")
    int ratePoint;

    @Column(name = "content")
    String content;

}
