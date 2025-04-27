package org.example.yogabusinessmanagementweb.dto.request.bmi;

import lombok.Data;

@Data
public class PersonIn {
    private float weight;
    private float height;
    private int age;
    private String gender;
    private String activity;
    private int mealsCaloriesPerc;
    private String weightLoss;
}
