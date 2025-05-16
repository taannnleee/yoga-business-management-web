package org.example.yogabusinessmanagementweb.dto.response.lecture;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LectureProductAdResponse {
    Long productId;
    String title;
    String imagePath;
    BigDecimal price;
    int startSecond;
    int endSecond;
}
