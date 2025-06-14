package org.example.yogabusinessmanagementweb.controller.user.payment;

import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.dto.request.order.OrderCreationRequest;
import org.example.yogabusinessmanagementweb.dto.request.order.OrderVnpayRequest;
import org.example.yogabusinessmanagementweb.dto.request.orderCourse.OrderCourseCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.ApiResponse;
import org.example.yogabusinessmanagementweb.dto.response.payment.PaymentVnpayResponse;
import org.example.yogabusinessmanagementweb.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/payment")
@Slf4j
public class PaymentVnpayController {
    PaymentService paymentService;

    @PostMapping("/vn-pay")
    public ApiResponse<PaymentVnpayResponse> pay(HttpServletRequest request,
                                                 @RequestBody OrderCreationRequest orderRequest) throws JsonProcessingException {
        // You can pass the addressId, paymentMethod, and products from the request body
        PaymentVnpayResponse response = paymentService.createVnPayPayment(request, orderRequest);
        return new ApiResponse<>(HttpStatus.OK.value(), "Success", response);
    }



    @GetMapping("/vn-pay-callback")
    public void payCallbackHandler(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String status = request.getParameter("vnp_ResponseCode");
        String transactionId = request.getParameter("vnp_TransactionNo");
        String orderInfo = request.getParameter("vnp_OrderInfo");

        // Mặc định
        String orderId = "unknown";
        String addressId = "unknown";
        String paymentMethod = "unknown";
        String listCartIds = "unknown";

        if (orderInfo != null) {
            String[] infoParts = orderInfo.split("\\|");
            if (infoParts.length > 0) orderId = infoParts[0];
            if (infoParts.length > 1) addressId = infoParts[1];
            if (infoParts.length > 2) paymentMethod = infoParts[2];
            if (infoParts.length > 3) listCartIds = infoParts[3];
        }

        Long vnp_Amount_temp = Long.valueOf(request.getParameter("vnp_Amount"));
        String vnp_Amount = String.valueOf(vnp_Amount_temp / 100);

        String frontendUrl = "http://localhost:3000/payment/result";

        String redirectUrl = frontendUrl
                + "?status=" + ("00".equals(status) ? "success" : "fail")
                + "&transactionId=" + ("00".equals(status) ? transactionId : "unknown")
                + "&addressId=" + addressId
                + "&paymentMethod=" + paymentMethod
                + "&vnp_Amount=" + vnp_Amount
                + "&listCartIds=" + listCartIds;

        response.sendRedirect(redirectUrl);
    }

    @PostMapping("/course/vn-pay")
    public ApiResponse<PaymentVnpayResponse> payCourse(HttpServletRequest request,@RequestBody OrderCourseCreationRequest orderRequest
                                                 ) throws JsonProcessingException {
        System.out.println("heheh"+ orderRequest.getCourseCartId());
        // You can pass the addressId, paymentMethod, and products from the request body
        PaymentVnpayResponse response = paymentService.createVnPayPaymentCourse(request,orderRequest);
        return new ApiResponse<>(HttpStatus.OK.value(), "Success", response);
    }

}
