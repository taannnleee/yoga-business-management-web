    package org.example.yogabusinessmanagementweb.dto.request.orderCourse;
    import lombok.Data;
    import lombok.RequiredArgsConstructor;
    import lombok.experimental.FieldDefaults;

    import java.math.BigDecimal;
    import java.util.List;

    @Data
    @RequiredArgsConstructor
    @FieldDefaults(level = lombok.AccessLevel.PRIVATE)
    public class OrderCourseCreationRequest {
        List<String> courseCartId;
    }
