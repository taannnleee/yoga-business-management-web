package org.example.yogabusinessmanagementweb.common.Enum;

public enum EpaymentMethod {
    CASHPAYMENT(0),
    MOMO(1);
    private final int value;
    EpaymentMethod(int value) {
        this.value = value;
    }
}
