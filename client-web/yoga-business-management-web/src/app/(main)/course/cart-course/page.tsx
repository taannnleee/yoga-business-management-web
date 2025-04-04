// pages/course/CartCourse.tsx
import React from 'react';
import CartItemCourse from '@/app/(main)/course/cart-course/CartItemCourse';

// Khai báo kiểu dữ liệu cho sản phẩm trong giỏ hàng
interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

const CartCourse = () => {
    // Giả sử có dữ liệu mẫu cho giỏ hàng
    const cartItems: CartItem[] = [
        { id: 1, name: 'Yoga Beginner Course', price: 25, quantity: 1 },
        { id: 2, name: 'Advanced Yoga Course', price: 40, quantity: 2 },
    ];

    // Tính tổng số tiền giỏ hàng
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
                                <CartItemCourse
                                    key={item.id}
                                    id={item.id}
                                    name={item.name}
                                    price={item.price}
                                    quantity={item.quantity}
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

export default CartCourse;
