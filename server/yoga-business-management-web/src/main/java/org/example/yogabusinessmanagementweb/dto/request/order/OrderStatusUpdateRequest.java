package org.example.yogabusinessmanagementweb.dto.request.order;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class OrderStatusUpdateRequest {
    String status;
}
