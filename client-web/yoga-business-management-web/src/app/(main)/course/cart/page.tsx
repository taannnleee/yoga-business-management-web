
'use client';
import React, { useState } from "react";
import CartItemComponent from "@/app/(main)/course/cart/CartItem"; // Giả sử bạn đã tạo component CartItemComponente


interface CartItemProps {
    item: CartItem;
    onQuantityChange: (id: number, quantity: number) => void; // Hàm xử lý thay đổi số lượng
}

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}
const CartPage: React.FC = () => {
    // Giả sử dữ liệu trong giỏ hàng
    const [cartItems, setCartItems] = useState<CartItem[]>([
        { id: 1, name: "Yoga Beginner Course", price: 25, quantity: 1 },
        { id: 2, name: "Advanced Yoga Course", price: 40, quantity: 2 },
    ]);

    // Hàm xử lý thay đổi số lượng
    const handleQuantityChange = (id: number, quantity: number) => {
        const updatedCartItems = cartItems.map((item) =>
            item.id === id ? { ...item, quantity } : item
        );
        setCartItems(updatedCartItems);
    };

    // Tính tổng số tiền trong giỏ hàng
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold text-center text-gray-900">Giỏ Hàng</h1>

            <div className="mt-6">
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left">Sản phẩm</th>
                                <th className="px-4 py-2 text-left">Giá</th>
                                <th className="px-4 py-2 text-left">Số lượng</th>
                                <th className="px-4 py-2 text-right">Tổng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <CartItemComponent
                                    key={item.id}
                                    item={item}
                                    onQuantityChange={handleQuantityChange}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex justify-between items-center">
                    <button className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none">
                        Tiến hành thanh toán
                    </button>
                    <div className="text-xl font-semibold">Tổng: {total} đ</div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
