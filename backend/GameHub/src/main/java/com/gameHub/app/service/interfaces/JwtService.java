package com.gameHub.app.service.interfaces;

import io.jsonwebtoken.Claims;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Component
public interface JwtService {

    String generateToken(UserDetails details);

    String generateToken(Map<String, Object> extraClaims, UserDetails details);

    String getUsername(String token);

    <T> T getClaim(String token, Function<Claims, T> claimsResolver);

    Claims getAllClaims(String token);

    SecretKey getSignKey();

    boolean validateToken(String token, UserDetails userDetails);

    boolean isTokenExpired(String token);

    Date getExpiration(String token);
}
