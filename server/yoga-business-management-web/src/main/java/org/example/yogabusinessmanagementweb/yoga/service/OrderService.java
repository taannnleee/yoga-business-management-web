package org.example.yogabusinessmanagementweb.yoga.service;

import org.example.yogabusinessmanagementweb.yoga.dto.request.order.OrderCreationRequest;
import org.example.yogabusinessmanagementweb.yoga.dto.response.order.OrderCreationResponse;

public interface OrderService {
    OrderCreationResponse createOrder(OrderCreationRequest orderCreationRequest);
}
