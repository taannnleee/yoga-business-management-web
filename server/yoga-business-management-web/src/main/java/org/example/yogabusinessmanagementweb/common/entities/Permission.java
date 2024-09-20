package org.example.yogabusinessmanagementweb.common.entities;


import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "Permission")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Permission extends AbstractEntity<Integer> {
    private String name;
    private String description;
    private String pCode;

    @OneToMany(mappedBy = "permission")
    private List<GroupHasPermission> groupHasPermissions;
}
