"use client";
import React from "react";

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface CartItemProps {
    item: CartItem;
    onQuantityChange: (id: number, quantity: number) => void; // Hàm xử lý thay đổi số lượng
}

const CartItemComponent: React.FC<CartItemProps> = ({ item, onQuantityChange }) => {
    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseInt(event.target.value, 10);
        onQuantityChange(item.id, newQuantity);
    };

    return (
        <tr>
            <td className="px-4 py-2">{item.name}</td>
            <td className="px-4 py-2">{item.price} đ</td>
            <td className="px-4 py-2">
                <input
                    type="number"
                    value={item.quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    className="w-16 text-center border border-gray-300"
                />
            </td>
            <td className="px-4 py-2 text-right">{item.price * item.quantity} đ</td>
        </tr>
    );
};

export default CartItemComponent;
