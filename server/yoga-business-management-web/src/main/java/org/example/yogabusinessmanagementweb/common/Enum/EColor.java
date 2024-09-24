package org.example.yogabusinessmanagementweb.common.Enum;
import lombok.Getter;
@Getter
public enum EColor {
    BLACK(0),
    WHITE(1),
    BLUE(2),
    RED(3);
    private final int value;
    EColor(int value) {
        this.value = value;
    }
}

