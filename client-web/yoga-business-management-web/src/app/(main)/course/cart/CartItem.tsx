"use client";
import React from "react";
import Image from "next/image";

interface CartItem {
  id: number;
  idCourse: number;
  name: string;
  totalPrice: number;
  quantity: number;
  imagePath: string;
}

interface CartItemProps {
  cartItems: CartItem[];
  deleteitem: (id: string) => Promise<void>;
  selectedItems: number[];
  setSelectedItems: React.Dispatch<React.SetStateAction<number[]>>;
}

const CartItemComponent: React.FC<CartItemProps> = ({
  cartItems,
  deleteitem,
  selectedItems,
  setSelectedItems,
}) => {
  const handleCheckboxChange = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems((prev) => [...prev, id]);
    }
  };

  return (
    <div className="md:col-span-2 space-y-6">
      {Array.isArray(cartItems) && cartItems.length > 0 ? (
        cartItems.map((item) => {
          const isChecked = selectedItems.includes(item.id);

          return (
            <div key={item.id} className="flex items-start gap-4 border-b pb-6">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleCheckboxChange(item.id)}
                className="mt-2"
              />

              <Image
                src={item.imagePath}
                alt={item.name}
                width={100}
                height={100}
                className="rounded-md"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <div className="text-sm text-gray-500">Bán chạy nhất</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-purple-600 font-semibold text-lg">
                    {(item.totalPrice ?? 0).toLocaleString()} đ
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {(item.totalPrice ?? 0).toLocaleString()} đ
                  </span>
                </div>
              </div>
              <div
                onClick={() => deleteitem(item.id.toString())}
                className="text-purple-600 font-bold cursor-pointer"
              >
                Xóa
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-gray-500 italic">Giỏ hàng của bạn đang trống.</div>
      )}
    </div>
  );
};

export default CartItemComponent;
