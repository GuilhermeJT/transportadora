package com.guilhermejt.transportadora.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Desliga CSRF (senão bloqueia POST/PUT sem token)
                .csrf(csrf -> csrf.disable())
                // H2 Console precisa de frames
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))
                // Configuração de rotas
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/h2-console/**").permitAll()   // libera H2 Console
                        .requestMatchers("/usuario/**").permitAll()      // libera API de Usuario
                        .anyRequest().authenticated()                    // o resto precisa de login
                )
                // Login padrão do Spring Security (se for acessar /login)
                .formLogin(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
