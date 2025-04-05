// components/WishListCourseItem.tsx
import React from 'react';

// Khai báo kiểu dữ liệu cho một sản phẩm trong danh sách yêu thích
interface WishListCourseItemProps {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const WishListCourseItem: React.FC<WishListCourseItemProps> = ({ id, name, price, quantity }) => {
  return (
    <tr key={id}>
      <td className="px-4 py-2">{name}</td>
      <td className="px-4 py-2">{price} đ</td>
      <td className="px-4 py-2">{quantity}</td>
      <td className="px-4 py-2 text-right">{price * quantity} đ</td>
    </tr>
  );
};

export default WishListCourseItem;
