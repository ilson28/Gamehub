package com.gameHub.app.service.implementation;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.gameHub.app.service.interfaces.JwtService;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtServiceImpl implements JwtService {

    @Value("${app.jwt.secret_key} ")
    private String SECRET_KEY;
    private final Integer expirationKey = 604800000;

    @Override
    public String generateToken(UserDetails details) {
        return this.generateToken(new HashMap<>(), details);
    }

    @Override
    public String generateToken(Map<String, Object> extraClaims, UserDetails details) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(details.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + this.expirationKey))
                .signWith(this.getSignKey(), Jwts.SIG.HS256)
                .compact();
    }

    @Override
    public String getUsername(String token) {
        return getClaim(token, Claims::getSubject);
    }

    @Override
    public <T> T getClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = getAllClaims(token);

        return claimsResolver.apply(claims);
    }

    @Override
    public Claims getAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    @Override
    public SecretKey getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(this.SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    @Override
    public boolean validateToken(String token, UserDetails userDetails) {
        String username = getUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    @Override
    public boolean isTokenExpired(String token) {
        return getExpiration(token).before(new Date());
    }

    @Override
    public Date getExpiration(String token) {
        return getClaim(token, Claims::getExpiration);
    }
}
