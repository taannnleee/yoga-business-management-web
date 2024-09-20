package org.example.yogabusinessmanagementweb.common.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "GroupHasPermission")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class GroupHasPermission extends AbstractEntity<Long> {
    @ManyToOne
    @JoinColumn(name = "group_id")
    private Group group;

    @ManyToOne
    @JoinColumn(name = "permission_id")
    private Permission permission;
}
