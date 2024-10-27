package org.example.yogabusinessmanagementweb.service;

import jakarta.servlet.http.HttpServletRequest;
import org.example.yogabusinessmanagementweb.dto.request.order.OrderCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.order.OrderCreationResponse;
import org.example.yogabusinessmanagementweb.dto.response.order.OrderResponse;

public interface OrderService {
    OrderCreationResponse createOrder(HttpServletRequest request, OrderCreationRequest orderRequest);

    OrderResponse showOrder(HttpServletRequest request);
}
