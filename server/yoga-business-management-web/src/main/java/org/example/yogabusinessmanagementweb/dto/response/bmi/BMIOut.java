package org.example.yogabusinessmanagementweb.dto.response.bmi;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class BMIOut {
    private float bmi;
    private String category;
    private String color;
    private List<Map<String, Object>> calories;
}