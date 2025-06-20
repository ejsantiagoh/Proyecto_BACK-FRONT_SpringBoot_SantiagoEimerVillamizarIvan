package com.c4.atunesdelpacifico.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    private static final String SECRET = "C4mpus.2025C4mpus.2025C4mpus.2025C4mpus.2025";
    private static final Key SECRET_KEY = Keys.hmacShaKeyFor(SECRET.getBytes());
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 5; // 5 horas

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class)); // Sin añadir prefijo
    }

    private <T> T extractClaim(String token, Function<Claims, T> resolver) {
        return resolver.apply(getClaims(token));
    }

    private Claims getClaims(String token) {
        return Jwts
            .parserBuilder()
            .setSigningKey(SECRET_KEY)
            .build()
            .parseClaimsJws(token)
            .getBody();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        final String role = extractRole(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token) && role != null;
    }

    private boolean isTokenExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }

    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
            .setSubject(userDetails.getUsername())
            .claim("role", userDetails.getAuthorities().stream().findFirst().map(Object::toString).orElse("USER"))
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
            .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
            .compact();
    }
}