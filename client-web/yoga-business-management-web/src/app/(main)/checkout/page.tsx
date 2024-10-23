"use client";
import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Grid,
    TextField,
    Button,
    Paper,
    Divider,
    FormControlLabel,
    Radio,
    RadioGroup,
} from "@mui/material";

interface IProduct {
    id: string;
    title: string;
    quantity: number;
    price: number;
}

const Checkout: React.FC = () => {
    const [shippingInfo, setShippingInfo] = useState({
        fullName: "",
        address: {
            houseNumber: "",
            street: "",
            district: "",
            city: "",
        },
        phone: "",
    });

    const [paymentMethod, setPaymentMethod] = useState("creditCard");
    const [products, setProducts] = useState<IProduct[]>([]); // State để lưu sản phẩm trong giỏ hàng
    const [totalPrice, setTotalPrice] = useState(0); // State để lưu tổng tiền
    const [loading, setLoading] = useState(true); // State loading
    const [error, setError] = useState<string | null>(null); // State error

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "fullName" || name === "phone") {
            setShippingInfo({
                ...shippingInfo,
                [name]: value,
            });
        } else {
            setShippingInfo({
                ...shippingInfo,
                address: {
                    ...shippingInfo.address,
                    [name]: value,
                },
            });
        }
    };

    const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentMethod(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Shipping Info: ", shippingInfo);
        console.log("Payment Method: ", paymentMethod);
        // Gửi thông tin đơn hàng tới backend hoặc xử lý thanh toán tại đây
    };

    // Hàm gọi API để lấy địa chỉ mặc định
    const fetchDefaultAddress = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch("http://localhost:8080/api/user/get-user-address-default", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch default address");
            }

            const data = await response.json();
            const addressData = data.data; // Đảm bảo API trả về theo cấu trúc của bạn
            setShippingInfo({
                fullName: addressData.fullname,
                phone: addressData.phone,
                address: {
                    houseNumber: addressData.address.houseNumber,
                    street: addressData.address.street,
                    district: addressData.address.district,
                    city: addressData.address.city,
                },
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Hàm gọi API để lấy giỏ hàng
    const fetchCart = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch("http://localhost:8080/api/cart/show-cart", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch cart");
            }

            const data = await response.json();
            const cartItems = data.data.cartItem.map((item: any) => ({
                id: item.product.id,
                title: item.product.title,
                quantity: item.quantity,
                price: item.product.price,
            }));

            setProducts(cartItems);
            setTotalPrice(data.data.totalPrice);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Gọi API lấy địa chỉ và giỏ hàng khi component được mount
    useEffect(() => {
        fetchDefaultAddress();
        fetchCart();
    }, []);

    return (
        <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            <Typography variant="h4" sx={{ marginBottom: "20px", fontWeight: "bold" }}>
                Checkout
            </Typography>
            <Grid container spacing={3}>
                {/* Thông tin giao hàng */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ padding: "20px" }}>
                        <Typography variant="h6" sx={{ marginBottom: "10px", fontWeight: "bold" }}>
                            Thông tin giao hàng
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Họ và tên"
                                    name="fullName"
                                    fullWidth
                                    value={shippingInfo.fullName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Số nhà"
                                    name="houseNumber"
                                    fullWidth
                                    value={shippingInfo.address.houseNumber}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Đường"
                                    name="street"
                                    fullWidth
                                    value={shippingInfo.address.street}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Quận/Huyện"
                                    name="district"
                                    fullWidth
                                    value={shippingInfo.address.district}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Thành phố"
                                    name="city"
                                    fullWidth
                                    value={shippingInfo.address.city}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Số điện thoại"
                                    name="phone"
                                    fullWidth
                                    value={shippingInfo.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Phương thức thanh toán */}
                    <Paper sx={{ padding: "20px", marginTop: "20px" }}>
                        <Typography variant="h6" sx={{ marginBottom: "10px", fontWeight: "bold" }}>
                            Phương thức thanh toán
                        </Typography>
                        <RadioGroup value={paymentMethod} onChange={handlePaymentChange}>
                            <FormControlLabel value="creditCard" control={<Radio />} label="Thẻ tín dụng / Thẻ ghi nợ" />
                            <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
                            <FormControlLabel value="cash" control={<Radio />} label="Thanh toán khi nhận hàng (COD)" />
                        </RadioGroup>
                    </Paper>
                </Grid>

                {/* Tổng kết đơn hàng */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ padding: "20px" }}>
                        <Typography variant="h6" sx={{ marginBottom: "10px", fontWeight: "bold" }}>
                            Tổng kết đơn hàng
                        </Typography>
                        <Divider sx={{ marginBottom: "10px" }} />
                        {loading ? (
                            <Typography>Loading...</Typography>
                        ) : error ? (
                            <Typography>Error: {error}</Typography>
                        ) : products.length > 0 ? (
                            <>
                                {products.map((product) => (
                                    <Box display="flex" justifyContent="space-between" key={product.id} sx={{ marginBottom: "10px" }}>
                                        <Typography>{product.title} (x{product.quantity})</Typography>
                                        <Typography>{(product.price * product.quantity).toLocaleString()} đ</Typography>
                                    </Box>
                                ))}
                                <Divider sx={{ marginBottom: "10px" }} />
                                <Box display="flex" justifyContent="space-between" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                                    <Typography>Tổng cộng</Typography>
                                    <Typography>{totalPrice.toLocaleString()} đ</Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ padding: "10px", fontWeight: "bold" }}
                                    onClick={handleSubmit}
                                >
                                    Đặt hàng
                                </Button>
                            </>
                        ) : (
                            <Typography>Giỏ hàng trống.</Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Checkout;
