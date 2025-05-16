package org.example.yogabusinessmanagementweb.service;

import jakarta.servlet.http.HttpServletRequest;
import org.apache.poi.hpsf.Decimal;
import org.example.yogabusinessmanagementweb.common.entities.MembershipType;
import org.example.yogabusinessmanagementweb.dto.response.ApiResponse;

import java.math.BigDecimal;

public interface MembershipService {
    MembershipType getMembershipType(HttpServletRequest request);
    BigDecimal totalAmount(HttpServletRequest request);
    void updateMembershipTypeByTotal(HttpServletRequest request);
}
