package org.example.yogabusinessmanagementweb.authentication.service;

import org.example.yogabusinessmanagementweb.authentication.dto.request.order.OrderCreationRequest;
import org.example.yogabusinessmanagementweb.authentication.dto.response.order.OrderCreationResponse;

public interface OrderService {
    OrderCreationResponse createOrder(OrderCreationRequest orderCreationRequest);
}
