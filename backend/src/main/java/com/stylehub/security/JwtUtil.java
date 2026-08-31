package com.stylehub.security;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {
    @Value("${app.jwt.secret}") private String secret;
    @Value("${app.jwt.expiration-ms}") private long expMs;
    private SecretKey key() { return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)); }
    public String generateToken(UserDetails u) {
        Date now = new Date();
        return Jwts.builder().subject(u.getUsername()).issuedAt(now).expiration(new Date(now.getTime()+expMs)).signWith(key()).compact();
    }
    public String extractUsername(String t) { return claim(t,Claims::getSubject); }
    public boolean isTokenValid(String t, UserDetails u) { return extractUsername(t).equals(u.getUsername()) && !claim(t,Claims::getExpiration).before(new Date()); }
    private <T> T claim(String t, Function<Claims,T> r) { return r.apply(Jwts.parser().verifyWith(key()).build().parseSignedClaims(t).getPayload()); }
}
