package org.example.yogabusinessmanagementweb.dto.response.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PaymentVnpayResponse {
    private int code; // Ensure this is an int, as your logic uses integers
    private String message;
    private String paymentUrl;

    public PaymentVnpayResponse(int code, String message, String paymentUrl) {
        this.code = code;
        this.message = message;
        this.paymentUrl = paymentUrl;
    }
}
