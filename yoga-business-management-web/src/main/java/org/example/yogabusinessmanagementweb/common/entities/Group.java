package org.example.yogabusinessmanagementweb.common.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "Groupp")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Group extends AbstractEntity <Long>{
    private String name;
    private String description;

    @OneToOne
    private Role role;

    @OneToMany(mappedBy = "group")
    private List<GroupHasUser> groupHasUsers;
}
