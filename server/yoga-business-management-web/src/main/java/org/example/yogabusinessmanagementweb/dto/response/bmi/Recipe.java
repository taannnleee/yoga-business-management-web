package org.example.yogabusinessmanagementweb.dto.response.bmi;

import lombok.Data;
import java.util.List;

@Data
public class Recipe {
    private String name;
    private String cookTime;
    private String prepTime;
    private String totalTime;
    private List<String> recipeIngredientParts;
    private float calories;
    private float fatContent;
    private float saturatedFatContent;
    private float cholesterolContent;
    private float sodiumContent;
    private float carbohydrateContent;
    private float fiberContent;
    private float sugarContent;
    private float proteinContent;
    private List<String> recipeInstructions;
}
