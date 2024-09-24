package org.example.yogabusinessmanagementweb.authentication.service;

import org.example.yogabusinessmanagementweb.common.entities.Token;

public interface TokenService {

    Long save(Token token);
    String delete(Token token);
    Token getTokenByUsername(String username);
}
