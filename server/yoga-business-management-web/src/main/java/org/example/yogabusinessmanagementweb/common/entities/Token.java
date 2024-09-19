package org.example.yogabusinessmanagementweb.common.entities;


import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serializable;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "Token")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Token extends AbstractEntity<Long> implements Serializable {
    private String username;
    private String accessToken;
    private String refreshToken;
    private String OTP;


}
