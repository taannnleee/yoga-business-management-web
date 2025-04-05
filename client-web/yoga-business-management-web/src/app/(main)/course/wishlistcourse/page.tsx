// pages/course/WishListCourse.tsx
import React from 'react';
import WishListCourseItem from '@/app/(main)/course/wishlistcourse/WishListCourseItem';

// Khai báo kiểu dữ liệu cho sản phẩm trong danh sách yêu thích
interface WishListItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

const WishListCourse = () => {
    // Giả sử có dữ liệu mẫu cho danh sách yêu thích
    const wishListItems: WishListItem[] = [
        { id: 1, name: 'Yoga Beginner Course', price: 25, quantity: 1 },
        { id: 2, name: 'Advanced Yoga Course', price: 40, quantity: 2 },
    ];

    // Tính tổng số tiền danh sách yêu thích
    const total = wishListItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold text-center text-gray-900">Danh Sách Yêu Thích</h1>

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
                            {wishListItems.map((item) => (
                                <WishListCourseItem
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

export default WishListCourse;
