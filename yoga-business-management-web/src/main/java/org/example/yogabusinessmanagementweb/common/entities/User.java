package org.example.yogabusinessmanagementweb.common.entities;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.print.attribute.standard.Media;
import java.io.Serializable;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "User")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter

public class User extends AbstractEntity<Long> implements UserDetails, Serializable {
    private String username;
    private String fullname;
    private String phone;
    private String email;
    private String password;
    private Date dateOfBirth;
    private String gender;
    private boolean status;

    @OneToMany(mappedBy = "user")
    private List<GroupHasUser> groupHasUsers;

    @OneToMany(mappedBy = "user")
    private List<UserHasRole> userHasRoles;

    @OneToMany(mappedBy = "user",cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Address> addresses ;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
