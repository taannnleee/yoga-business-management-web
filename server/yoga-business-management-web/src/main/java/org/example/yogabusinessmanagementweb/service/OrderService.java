package org.example.yogabusinessmanagementweb.service;

import org.example.yogabusinessmanagementweb.dto.request.order.OrderCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.order.OrderCreationResponse;

public interface OrderService {
    OrderCreationResponse createOrder(OrderCreationRequest orderCreationRequest);
}
