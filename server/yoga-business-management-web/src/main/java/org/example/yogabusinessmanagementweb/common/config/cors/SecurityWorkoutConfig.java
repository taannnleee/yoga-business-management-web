package org.example.yogabusinessmanagementweb.common.config.cors;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.yogabusinessmanagementweb.workoutwithAI.filter.JwtAuthenticationFilter;
import org.example.yogabusinessmanagementweb.workoutwithAI.service.CustomUserDetailService;
import org.example.yogabusinessmanagementweb.workoutwithAI.service.authen.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
//@EnableWebSecurity
public class SecurityWorkoutConfig {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable);

        http.cors(httpSecurityCorsConfigurer ->
                httpSecurityCorsConfigurer.configurationSource(corsConfigurationSource()));
        http.addFilterBefore(jwtAuthenticationFilter(),
                UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    JwtAuthenticationFilter jwtAuthenticationFilter() {
        return JwtAuthenticationFilter.builder()
                .jwtService(jwtService)
                .userDetailService(userDetailsService)
                .objectMapper(objectMapper)
                .build();
    }

    @Bean
    public AuthenticationProvider daoAuthenticationProvider(CustomUserDetailService customUserDetailService) {
        DaoAuthenticationProvider impl = new DaoAuthenticationProvider();
        impl.setUserDetailsService(customUserDetailService);
        impl.setHideUserNotFoundExceptions(false) ;
        return impl ;
    }


    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("*"));
        configuration.setAllowedMethods(List.of("*"));
        configuration.setAllowedHeaders(List.of("*"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
