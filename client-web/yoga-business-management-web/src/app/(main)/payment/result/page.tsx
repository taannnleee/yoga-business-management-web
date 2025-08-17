"use client";

import { useState, useEffect } from "react";
import Button from "@/components/atom/Button";
import { Typography, Box, CircularProgress, Divider } from "@mui/material";
import { useRouter } from "next/navigation";
import { API_URL } from "@/config/url";
import axiosInstance from "@/utils/axiosClient";

const PaymentResult = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [status, setStatus] = useState<string | null>(null);
    const [transactionId, setTransactionId] = useState<string | null>(null);
    const [addressId, setAddressId] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
    const [vnpAmount, setVnpAmount] = useState<string | null>(null);
    const [listCartIds, setlistCartIds] = useState<string | null>(null);

    const [isOrderCreated, setIsOrderCreated] = useState(false);

    // Get query parameters from URL using useRouter
    useEffect(() => {
        if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            setStatus(urlParams.get("status"));
            setTransactionId(urlParams.get("transactionId"));
            setAddressId(urlParams.get("addressId"));
            setPaymentMethod(urlParams.get("paymentMethod"));
            setVnpAmount(urlParams.get("vnp_Amount"));
            setlistCartIds(urlParams.get("listCartIds"));

        }
    }, []);

    const createOrder = async () => {
        if (isOrderCreated) return;
        setIsOrderCreated(true);
        setLoading(true);

        let parsed: number[] = [];

        if (listCartIds && listCartIds !== "unknown") {
            try {
                parsed = JSON.parse(listCartIds);
            } catch (err) {
                console.error("Không thể parse listCartIds:", err);
            }
        }
        try {
            if (addressId !== "") {
                const response = await axiosInstance.post(
                    `${API_URL}/api/order/create-order`,
                    {
                        addressId,
                        paymentMethod,
                        totalPricePromotion: vnpAmount,
                    }
                );
                console.log("Order created successfully:", response.data);
            } else {
                const response = await axiosInstance.post(
                    `${API_URL}/api/order-course/create`,
                    {
                        // courseCartId: selectedItems.map((item) => item.toString()),
                        courseCartId: parsed
                    }

                );
            }
        } catch (error: any) {
            console.error("Error creating order:", error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === "success" && !isOrderCreated) {
            createOrder();
        }
    }, [status]);

    return (
        <div className="max-w-2xl mx-auto p-6 border rounded-lg shadow-lg">
            <h2 className={`text-2xl font-semibold mb-4 ${status === "success" ? "text-green-600" : "text-red-600"}`}>
                {status === "success" ? "Giao dịch được thực hiện thành công" : "Giao dịch thất bại"}
            </h2>
            {status === "success" && <p className="mb-6">Cảm ơn quý khách đã sử dụng dịch vụ.</p>}

            <table className="min-w-full table-auto border-collapse">
                <tbody>
                    <tr className="border-b">
                        <td className="px-4 py-2 font-medium">Merchant ID</td>
                        <td className="px-4 py-2">CTTVNP01</td>
                    </tr>
                    <tr className="border-b">
                        <td className="px-4 py-2 font-medium">Merchant Name</td>
                        <td className="px-4 py-2">VNPAY Demo</td>
                    </tr>
                    <tr className="border-b">
                        <td className="px-4 py-2 font-medium">Merchant Transaction Reference</td>
                        <td className="px-4 py-2">{transactionId}</td>
                    </tr>
                    <tr className="border-b">
                        <td className="px-4 py-2 font-medium">Transaction Info</td>
                        <td className="px-4 py-2">Thanh toán đơn hàng thời gian: {new Date().toLocaleString()}</td>
                    </tr>
                    <tr className="border-b">
                        <td className="px-4 py-2 font-medium">Amount</td>
                        <td className="px-4 py-2">{vnpAmount}</td>
                    </tr>
                    <tr className="border-b">
                        <td className="px-4 py-2 font-medium">Currency</td>
                        <td className="px-4 py-2">VND</td>
                    </tr>
                    <tr className="border-b">
                        <td className="px-4 py-2 font-medium">Transaction Response Code</td>
                        <td className="px-4 py-2">00</td>
                    </tr>
                    <tr className="border-b">
                        <td className="px-4 py-2 font-medium">Message</td>
                        <td className="px-4 py-2">Giao dịch được thực hiện thành công. Cảm ơn quý khách đã sử dụng dịch vụ</td>
                    </tr>
                    <tr className="border-b">
                        <td className="px-4 py-2 font-medium">Transaction Number</td>
                        <td className="px-4 py-2">{transactionId}</td>
                    </tr>
                    <tr className="border-b">
                        <td className="px-4 py-2 font-medium">Bank</td>
                        <td className="px-4 py-2">NCB</td>
                    </tr>
                </tbody>
            </table>

            {/* Render different buttons based on status */}
            {status === "success" ? (
                <Button>
                    <a href={addressId ? "/status-order" : "/course/cart"}>Tiếp tục</a>
                </Button>
            ) : (
                <div className="flex space-x-4">
                    <Button className={"bg-red-500 text-white"}>
                        <a href="/checkout">Thử lại</a>
                    </Button>
                    <Button>
                        <a href="/home">Trở về Trang chủ</a>
                    </Button>
                </div>
            )}

            {loading && <p className="mt-4 text-blue-500">Đang xử lý...</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
    );
};

export default PaymentResult;
