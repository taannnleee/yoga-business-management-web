package org.example.yogabusinessmanagementweb.service;

import org.example.yogabusinessmanagementweb.common.entities.Token;
import org.example.yogabusinessmanagementweb.common.entities.User;

import java.util.List;

public interface TokenService {

    Token save(Token token);
    String delete(Token token);
    Token getTokenByUsername(String username);
    List<Token> getAllTokensByUserName(String userName);
}
