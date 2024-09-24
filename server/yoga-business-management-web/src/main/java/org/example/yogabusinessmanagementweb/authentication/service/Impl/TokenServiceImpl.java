package org.example.yogabusinessmanagementweb.authentication.service.Impl;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.authentication.repositories.TokenRepository;
import org.example.yogabusinessmanagementweb.authentication.service.TokenService;
import org.example.yogabusinessmanagementweb.common.entities.Token;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service

@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class TokenServiceImpl implements TokenService {
    TokenRepository tokenRepository;

    @Override
    public Long save(Token token) {
        Optional<Token> optional =  tokenRepository.findByUsername(token.getUsername());
        if(optional.isEmpty()) {
            tokenRepository.save(token);
            return token.getId();
        }else{
            Token currentToken = optional.get();
            currentToken.setAccessToken(token.getAccessToken());
            currentToken.setRefreshToken(token.getRefreshToken());
            tokenRepository.save(currentToken);
            return currentToken.getId();
        }

    }

    @Override
    public String delete(Token token) {
        tokenRepository.delete(token);
        return  "delete!!!";
    }

    @Override
    public Token getTokenByUsername(String username) {
        return tokenRepository.findByUsername(username).orElse(null);
    }
}
