"use client";
import React, { useState, useEffect } from "react";
import {
    AppBar,
    Tabs,
    Tab,
    Box,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Container,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface OrderItem {
    id: number;
    name: string;
    image: string;
    quantity: number;
    totalPrice: string;
    product: Product;
    currentVariant: any;
}

interface Order {
    id: number;
    totalPrice: number;
    totalItem: number;
    createdBy: string;
    status: string;
    payment: Payment;
    orderItems: OrderItem[];
    estatusOrder: String;
}

interface Product {
    imagePath: string;
}

interface Payment {
    nameMethod: string;
}

const OrderPage: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [orderData, setOrderData] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    const getStatusByTabIndex = (index: number) => {
        switch (index) {
            case 1:
                return "DELIVERING";
            case 2:
                return "PROCESSING";
            case 3:
                return "COMPLETED";
            case 4:
                return "CANCELLED";
            default:
                return "ALL";
        }
    };

    useEffect(() => {
        const fetchOrderData = async (status: string) => {
            setLoading(true);
            try {
                const token = localStorage.getItem("accessToken");
                const response = await fetch(`http://localhost:8080/api/order/get-all-order-by-status/${status}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setOrderData(data.data);
            } catch (error) {
                console.error("Error fetching order data:", error);
            } finally {
                setLoading(false);
            }
        };

        const status = getStatusByTabIndex(selectedTab);
        fetchOrderData(status);
    }, [selectedTab]); // Chạy lại khi tab thay đổi

    if (loading) {
        return <Typography>Loading...</Typography>;
    }
    const getVariantValues = (variants: any) => {
        if (!variants) {
            console.log('Variants is null or undefined');
            return 'No variants available';
        }

        const values = Object.keys(variants).map((variantType) => {
            const variantDetails = variants[variantType];

            if (!variantDetails) {
                console.log(`Variant type ${variantType} is missing`);
                return `${variantType}: N/A`;
            }

            const value = variantDetails.value || 'N/A'; // Nếu value không tồn tại, trả về 'N/A'
            console.log(`Variant type: ${variantType}, value: ${value}`);

            return `${variantType}: ${value}`;
        });

        return values.join(", ");
    };
    return (
        <Container>
            {/* Tabs for Order Types */}
            <AppBar position="static" color="default">
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    textColor="primary"
                    indicatorColor="primary"
                    variant="fullWidth"
                >
                    <Tab label="Tất cả" />
                    <Tab label="Đang giao" />
                    <Tab label="Đang xử lý" />
                    <Tab label="Thành công" />
                    <Tab label="Đã hủy" />
                </Tabs>
            </AppBar>

            {/* Order Information */}
            <Box mt={3}>
                {orderData.length > 0 ? (
                    orderData.map((order) => (
                        <Card key={order.id} sx={{ mb: 3 }}>
                            <CardContent>
                                {/* Order Summary */}
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="subtitle1">
                                        Mã đơn hàng: {order.id} | Người đặt: {order.createdBy}
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ textAlign: "right" }}
                                    >
                                        {order.estatusOrder}
                                    </Typography>
                                </Box>
                                <Typography variant="body2">
                                    Thanh toán: {order.payment.nameMethod} | Tổng số lượng: <strong>{order.totalItem}</strong> | Tổng tiền:{" "}
                                    <strong>{order.totalPrice}</strong>
                                </Typography>

                                {/* Accordion for Order Items */}
                                <Accordion sx={{ mt: 2 }}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography>Chi tiết sản phẩm</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {order.orderItems && order.orderItems.length > 0 ? (
                                            order.orderItems.map((item) => (
                                                <Card key={item.id} sx={{ display: "flex", mb: 2 }}>
                                                    <CardMedia
                                                        component="img"
                                                        sx={{ width: 120 }}
                                                        image={item.product.imagePath}
                                                        alt={item.name}
                                                    />
                                                    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                                                        <CardContent>
                                                            <Typography variant="h6">{item.name}</Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Số lượng: {item.quantity}
                                                            </Typography>
                                                            <Typography variant="body1" color="error">
                                                                Giá :{item.totalPrice}
                                                            </Typography>
                                                            <Typography variant="body2" color="success">
                                                                {getVariantValues(item.currentVariant)}
                                                            </Typography>
                                                        </CardContent>
                                                        <Box display="flex" justifyContent="flex-end" p={1}>
                                                            <Button variant="contained" color="success" size="small">
                                                                Mua lại
                                                            </Button>
                                                        </Box>
                                                    </Box>
                                                </Card>
                                            ))
                                        ) : (
                                            <Typography variant="body2">Không có sản phẩm nào trong đơn hàng.</Typography>
                                        )}
                                    </AccordionDetails>
                                </Accordion>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Typography variant="body2">Không có đơn hàng nào.</Typography>
                )}
            </Box>
        </Container>
    );
};

export default OrderPage;
