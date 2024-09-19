package org.example.yogabusinessmanagementweb.common.entities;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "Role")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Role extends AbstractEntity <Long>{
    private String name;
    private String description;

    @OneToMany(mappedBy = "role")
    private List<RoleHasPermission> roleHasPermissions;

    @OneToMany(mappedBy = "role")
    private List<UserHasRole> userHasRoles;
}
