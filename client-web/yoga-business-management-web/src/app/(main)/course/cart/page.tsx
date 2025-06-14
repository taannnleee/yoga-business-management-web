'use client';
import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosClient";
import Image from "next/image";
import CartItemComponent from "./CartItem";
import { API_URL } from "@/config/url";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";

interface OrderCourseCreationRequest {
    courseCartId: string[];
}

interface CartItem {
    id: number;
    idCourse: number;
    name: string;
    totalPrice: number;
    quantity: number;
    imagePath: string;
    price: number;
}

const CartPage: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const toast = useToast();
    const router = useRouter();


    const fetchCart = async () => {
        try {
            const response = await axiosInstance.get(`/api/course/cart/show-cart`);
            const data = response.data.data;
            setCartItems(data);
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const deleteitem = async (id: string) => {
        try {
            const response = await axiosInstance.post(`/api/course/cart/remove-from-cart`, {
                courseId: id,
            });

            if (response.status === 200) {
                setCartItems((prevCarts) =>
                    prevCarts.filter((item) => item.id.toString() !== id)
                );
            } else {
                console.warn("Xóa thất bại: API không trả về success.");
            }
        } catch (error) {
            console.error("Lỗi khi gọi API xóa:", error);
        }
    };
    const totalSelected = cartItems
        .filter((item) => selectedItems.includes(item.id))
        .reduce((sum, item) => sum + item.totalPrice, 0);

    const totalSelectedFormatted = totalSelected.toLocaleString("vi-VN") + " VNĐ";


    const handlePaymentVNPay = async () => {
        const orderRequest: OrderCourseCreationRequest = {
            courseCartId: selectedItems.map((item) => item.toString()),
        };
        console.log("Order Requestehehehehe:", orderRequest);

        try {

            const response = await axiosInstance.post(
                `${API_URL}/api/payment/course/vn-pay`,
                orderRequest,
                {
                    params: {
                        amount: totalSelectedFormatted,
                        bankCode: "NCB"
                    }
                    // ,
                    // headers: {
                    //     "Authorization": `Bearer ${token}`,
                    //     "Content-Type": "application/json",
                    // },
                }
            );
            const paymentUrl = response.data.data.paymentUrl;
            // Redirect to the payment URL
            router.push(paymentUrl);
        } catch (error: any) {
            console.error("Error initiating VNPay payment:", error.message);
            toast.sendToast("Error", "Error initiating VNPay payment", "error");
        }
    };

    const createOrder = async () => {
        try {
            const response = await axiosInstance.post(
                `${API_URL}/api/order-course/create`,
                {
                    courseCartId: selectedItems.map((item) => item.toString()),
                }

            );

            toast.sendToast("Success", "Đặt hàng thành công");
            router.replace("/course/status-order");
            setTimeout(() => {
                location.reload();
            }, 100); // Delay nhẹ để đảm bảo route đã thay đổi trước khi reload
        } catch (error: any) {
            console.error("Error creating order:", error.message);
            toast.sendToast("Error", "Error creating order", "error");
        } finally {
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-10 bg-white">
            <h1 className="text-3xl font-bold mb-8">Giỏ hàng</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <CartItemComponent
                    cartItems={cartItems}
                    deleteitem={deleteitem}
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                />
                <div className="bg-gray-50 p-6 rounded-md shadow-md">
                    <h2 className="text-xl font-bold mb-4">Tổng:</h2>
                    <div className="text-3xl font-bold text-purple-600 mb-2">{totalSelectedFormatted}</div>



                    <button
                        disabled={selectedItems.length === 0}
                        onClick={() => handlePaymentVNPay()}
                        className={`w-full text-white py-3 rounded transition
        ${selectedItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
                    >
                        Tiến hành thanh toán
                    </button>


                </div>
            </div>
        </div>
    );
};

export default CartPage;
