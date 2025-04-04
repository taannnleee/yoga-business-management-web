// components/CartItemCourse.tsx
import React from 'react';

// Khai báo kiểu dữ liệu cho một sản phẩm trong giỏ hàng
interface CartItemCourseProps {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const CartItemCourse: React.FC<CartItemCourseProps> = ({ id, name, price, quantity }) => {
  return (
    <tr key={id}>
      <td className="px-4 py-2">{name}</td>
      <td className="px-4 py-2">{price} đ</td>
      <td className="px-4 py-2">{quantity}</td>
      <td className="px-4 py-2 text-right">{price * quantity} đ</td>
    </tr>
  );
};

export default CartItemCourse;
