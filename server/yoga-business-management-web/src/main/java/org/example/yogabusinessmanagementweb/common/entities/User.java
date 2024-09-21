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
    String fullname;
    String phone;
    String email;
    String password;
    Date dateOfBirth;
    int gender;
    boolean status;
    int kind;
    String imagePath;

    @OneToMany(mappedBy = "user")
    List<GroupHasUser> groupHasUsers;


    @OneToMany(mappedBy = "user",cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    List<Address> addresses ;

    @OneToOne(mappedBy = "user")
    Cart cart;

    @OneToOne(mappedBy = "user")
    Wishlist wishlist;

    @OneToMany(mappedBy = "user")
    List<Order> order;

    @OneToOne()
    @JoinColumn(name = "token_id")
    Token token;

    @OneToOne()
    @JoinColumn(name = "healthyinformation_id")
    HealthyInformation healthyinformation;

    @OneToMany(mappedBy = "user")
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
