package org.example.yogabusinessmanagementweb.service;

import jakarta.servlet.http.HttpServletRequest;
import org.example.yogabusinessmanagementweb.dto.response.payment.PaymentVnpayResponse;

public interface PaymentService {
    PaymentVnpayResponse createVnPayPayment(HttpServletRequest request);
}
