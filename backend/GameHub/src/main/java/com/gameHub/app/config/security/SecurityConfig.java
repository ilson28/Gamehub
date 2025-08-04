package com.gameHub.app.config.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

@EnableWebSecurity
@EnableMethodSecurity
@Configuration
public class SecurityConfig {

        @Autowired
        private JwtFilter jwtFilter;

        @Autowired
        private AuthenticationProvider authenticationProvider;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {

                return httpSecurity.csrf(AbstractHttpConfigurer::disable)
                                .cors(Customizer.withDefaults())
                                .authorizeHttpRequests(request -> request.requestMatchers(publicEndpoints()).permitAll()
                                                .anyRequest().authenticated())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authenticationProvider(authenticationProvider)
                                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                                .build();

        }

        private RequestMatcher publicEndpoints() {

                return new OrRequestMatcher(
                                new AntPathRequestMatcher("/api/**"),
                                new AntPathRequestMatcher("/api/auth/**"),
                                new AntPathRequestMatcher("/swagger-ui/**"),
                                new AntPathRequestMatcher("/swagger-ui.html"),
                                new AntPathRequestMatcher("/v3/api-docs/**"));
        }

}
