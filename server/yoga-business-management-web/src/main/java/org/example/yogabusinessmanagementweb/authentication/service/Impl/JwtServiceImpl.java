package org.example.yogabusinessmanagementweb.authentication.service.Impl;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.example.yogabusinessmanagementweb.authentication.service.JwtService;
import org.example.yogabusinessmanagementweb.common.Enum.ETokenType;
import org.example.yogabusinessmanagementweb.common.entities.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import static org.example.yogabusinessmanagementweb.common.Enum.ETokenType.*;

@Service
public class JwtServiceImpl implements JwtService {
    @Value("${jwt.expiryTime}")
    private String expirytime  ;

    @Value("${jwt.secretKey}")
    private String secretKey;

    @Value("${jwt.refreshkey}")
    private String refreshkey;

    @Value("${jwt.resetKey}")
    private String resetKey;

    @Override
    public String generateToken(User user){
        return generateToken(new HashMap<>(), user);
    }

    @Override
    public String generateRefreshToken(User user) {
        return generateRefreshToken(new HashMap<>(), user);
    }

    @Override
    public String generateResetToken(User user) {
        return generateResetToken(new HashMap<>(), user);
    }

    @Override
    public String extractUsername(String token,ETokenType tokenType) {
        return extractClaim(token,tokenType, Claims::getSubject);
    }


    @Override
    public Boolean isValid(String token,ETokenType tokenType, UserDetails userDetails) {
        final String username = extractUsername(token,tokenType);
        return (username.equals(userDetails.getUsername()) && !isTokenExpried(token,tokenType)) ;
    }

    private boolean isTokenExpried(String token, ETokenType tokenType) {
        return  extractExpration(token,tokenType).before(new Date());
    }

    private Date extractExpration(String token, ETokenType tokenType) {
        return  extractClaim(token, tokenType,Claims::getExpiration);
    }

    public String generateToken(Map<String, Object> claims, UserDetails userDetails){
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis()+1000*60*60*24))
                .signWith(getKey(ACCESSTOKEN), SignatureAlgorithm.HS256)
                .compact();
    }
    public String generateRefreshToken(Map<String, Object> claims, UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60*24*14))
                .signWith(getKey(REFRESHTOKEN), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateResetToken(Map<String, Object> claims, UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))  //60phuts
                .signWith(getKey(RESETTOKEN), SignatureAlgorithm.HS256)
                .compact();
    }

        private Key getKey(ETokenType tokenType){
        switch(tokenType){
            case ACCESSTOKEN -> {return Keys.hmacShaKeyFor( Decoders.BASE64.decode(secretKey));}
            case REFRESHTOKEN -> {return Keys.hmacShaKeyFor( Decoders.BASE64.decode(refreshkey));}
            case RESETTOKEN -> {return Keys.hmacShaKeyFor( Decoders.BASE64.decode(resetKey));}
            default -> throw new InvalidDataAccessApiUsageException("Token type invalid");
        }
    }
    private <T> T extractClaim(String token,ETokenType tokenType, Function<Claims,T> claimsResolver){
        final Claims claims = extraAllClaim(token,tokenType);
        return claimsResolver.apply(claims);
    }

    private Claims extraAllClaim(String token, ETokenType tokenType) {
        return Jwts.parser().setSigningKey(getKey(tokenType)).build().parseClaimsJws(token).getBody();
    }
}
