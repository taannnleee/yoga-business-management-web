package org.example.yogabusinessmanagementweb.service;

import jakarta.servlet.http.HttpServletRequest;
import org.example.yogabusinessmanagementweb.common.entities.Order;
import org.example.yogabusinessmanagementweb.dto.request.order.OrderCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.order.OrderCreationResponse;
import org.example.yogabusinessmanagementweb.dto.response.order.OrderResponse;

import java.util.List;

public interface OrderService {
    OrderCreationResponse createOrder(HttpServletRequest request, OrderCreationRequest orderRequest);

    List<Order> showOrder(HttpServletRequest request);
}
