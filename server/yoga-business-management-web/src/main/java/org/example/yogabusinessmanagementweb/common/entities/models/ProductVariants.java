package org.example.yogabusinessmanagementweb.common.entities.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariants implements Serializable {
    private List<String> color;
    private List<String> size;

}