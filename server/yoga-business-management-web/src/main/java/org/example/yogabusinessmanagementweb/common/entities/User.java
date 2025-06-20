package org.example.yogabusinessmanagementweb.common.entities;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.Enum.EGender;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "users")
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
    @Enumerated(EnumType.STRING)
    EGender gender;
    String email;
    String fullname;
    String firstName;
    String lastName;

    @Temporal(TemporalType.DATE)
    Date dateOfBirth;
    String imagePath;
    String roles;
    String OTP;
    Date expired;
    boolean status;


    // User quản lý Address, một chiều
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    List<Address> addresses;

    @ColumnDefault(value = "0")
    private BigDecimal point;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "membership_type_id")
    private MembershipType membershipType;

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

    // Phương thức getAuthorities duy nhất
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(roles)); // Chuyển đổi Role thành GrantedAuthority
    }
}
