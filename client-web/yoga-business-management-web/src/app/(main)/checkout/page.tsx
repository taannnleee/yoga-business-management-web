"use client"
import React, { useState } from "react";
import { Box, Typography, Grid, TextField, Button, Paper, Divider, FormControlLabel, Radio, RadioGroup } from "@mui/material";

const Checkout: React.FC = () => {
    const [shippingInfo, setShippingInfo] = useState({
        fullName: "",
        address: "",
        phone: "",
        city: "",
        zipCode: "",
    });

    const [paymentMethod, setPaymentMethod] = useState("creditCard");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShippingInfo({
            ...shippingInfo,
            [e.target.name]: e.target.value,
        });
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
                                    label="Địa chỉ"
                                    name="address"
                                    fullWidth
                                    value={shippingInfo.address}
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
                            <Grid item xs={4}>
                                <TextField
                                    label="Thành phố"
                                    name="city"
                                    fullWidth
                                    value={shippingInfo.city}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    label="Mã Zip"
                                    name="zipCode"
                                    fullWidth
                                    value={shippingInfo.zipCode}
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
                        <Box display="flex" justifyContent="space-between" sx={{ marginBottom: "10px" }}>
                            <Typography>Sản phẩm 1</Typography>
                            <Typography>500.000 đ</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" sx={{ marginBottom: "10px" }}>
                            <Typography>Sản phẩm 2</Typography>
                            <Typography>300.000 đ</Typography>
                        </Box>
                        <Divider sx={{ marginBottom: "10px" }} />
                        <Box display="flex" justifyContent="space-between" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                            <Typography>Tổng cộng</Typography>
                            <Typography>800.000 đ</Typography>
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
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Checkout;
