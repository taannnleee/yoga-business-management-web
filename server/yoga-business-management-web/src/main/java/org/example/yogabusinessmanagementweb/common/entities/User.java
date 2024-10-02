package org.example.yogabusinessmanagementweb.common.entities;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.print.attribute.standard.Media;
import java.io.Serializable;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "User")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class User extends AbstractEntity<Long>  implements UserDetails, Serializable {
    String username;
    String password;
    String phone;
    String gender;
    String email;

    String fullname;

    Date dateOfBirth;
    String imagePath;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    List<Address> addresses;

    @OneToMany(mappedBy = "user")
    List<GroupHasUser> groupHasUsers;
    int kind;
    boolean status;

    @OneToOne()
    Wishlist wishlist;

    @OneToOne
    Token token;

    @OneToMany()
    List<UserHasYogaWorkout> yogaWorkouts;

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
