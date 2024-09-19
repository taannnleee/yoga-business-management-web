package org.example.yogabusinessmanagementweb.common.entities;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "GroupHasUser")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter

public class GroupHasUser extends AbstractEntity<Long>{
    @ManyToOne
    @JoinColumn(name = "group_id")
    private Group group;

    @ManyToOne
    @JoinColumn(name = "user_idd")
    private User user;

}
