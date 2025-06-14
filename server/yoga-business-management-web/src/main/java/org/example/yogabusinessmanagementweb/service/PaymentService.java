package org.example.yogabusinessmanagementweb.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.HttpServletRequest;
import org.example.yogabusinessmanagementweb.dto.request.order.OrderCreationRequest;
import org.example.yogabusinessmanagementweb.dto.request.order.OrderVnpayRequest;
import org.example.yogabusinessmanagementweb.dto.request.orderCourse.OrderCourseCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.payment.PaymentVnpayResponse;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface PaymentService {
    PaymentVnpayResponse createVnPayPayment(HttpServletRequest request,
                                            OrderCreationRequest orderRequest) throws JsonProcessingException;
    PaymentVnpayResponse createVnPayPaymentCourse(HttpServletRequest request, OrderCourseCreationRequest orderRequest
                                            ) throws JsonProcessingException;

}
