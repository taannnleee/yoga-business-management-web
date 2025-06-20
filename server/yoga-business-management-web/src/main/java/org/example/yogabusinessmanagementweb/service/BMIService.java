package org.example.yogabusinessmanagementweb.service;


import org.example.yogabusinessmanagementweb.dto.request.bmi.PersonIn;
import org.example.yogabusinessmanagementweb.dto.response.bmi.BMIOut;

public interface BMIService {
    BMIOut calculateCalories(PersonIn personIn);
    Object recommendMeals(PersonIn personIn);
}
