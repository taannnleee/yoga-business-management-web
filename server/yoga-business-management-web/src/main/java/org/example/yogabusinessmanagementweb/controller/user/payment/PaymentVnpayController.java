package org.example.yogabusinessmanagementweb.controller.user.payment;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.dto.response.ApiResponse;
import org.example.yogabusinessmanagementweb.dto.response.payment.PaymentVnpayResponse;
import org.example.yogabusinessmanagementweb.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/payment")
@Slf4j
public class PaymentVnpayController {
    PaymentService paymentService;

    @GetMapping("/vn-pay")
    public ApiResponse<PaymentVnpayResponse> pay(HttpServletRequest request) {
        return new ApiResponse<>(HttpStatus.OK.value(), "Success", paymentService.createVnPayPayment(request));
    }

    @GetMapping("/vn-pay-callback")
    public ApiResponse<PaymentVnpayResponse> payCallbackHandler(HttpServletRequest request) {
        String status = request.getParameter("vnp_ResponseCode");
        if ("00".equals(status)) { // Check for successful status
            // Assuming '0' is for success, so using int instead of string
            return new ApiResponse<>(HttpStatus.OK.value(), "Success", new PaymentVnpayResponse(0, "Success", ""));
        } else {
            return new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), "Failed", null);
        }
    }
}
