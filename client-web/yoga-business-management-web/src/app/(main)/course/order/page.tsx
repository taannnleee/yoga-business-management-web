"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosClient";
import {
    AppBar,
    Tabs,
    Tab,
    Container,
    Box,
    Typography,
} from "@mui/material";

interface OrderItem {
    id: number;
    idCourse: number;
    name: string;
    totalPrice: number;
    imagePath: string;
}

const OrderCourse = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [orders, setOrders] = useState<OrderItem[]>([]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axiosInstance.get("/api/order-course/show-order");
                const data = res.data.data;
                setOrders(data);
            } catch (err) {
                console.error("Lỗi gọi API:", err);
            }
        };

        fetchOrders();
    }, []);

    return (
        <Container>

            {/* Danh sách đơn hàng */}
            <Box mt={4} display="flex" flexDirection="column" gap={3}>
                {orders.map((item) => (
                    <Box
                        key={item.id}
                        display="flex"
                        alignItems="center"
                        border="1px solid #e0e0e0"
                        borderRadius="8px"
                        padding={2}
                        boxShadow={1}
                        gap={2}
                    >
                        {/* Hình ảnh khóa học */}
                        <img
                            src={item.imagePath}
                            alt={item.name}
                            style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 8 }}
                        />

                        {/* Thông tin khóa học */}
                        <Box display="flex" flexDirection="column" flex={1}>
                            <Typography fontWeight="bold" fontSize="16px">
                                {item.name}
                            </Typography>
                            {/* <Typography color="gray" fontSize="14px">
                                ID đơn hàng: {item.id}
                            </Typography> */}
                            <Typography color="purple" fontWeight="bold" fontSize="15px">
                                {item.totalPrice.toLocaleString("vi-VN")} VNĐ
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Container>
    );
};

export default OrderCourse;
