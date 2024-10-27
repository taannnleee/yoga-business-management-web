"use client";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/useToast";
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
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
} from "@mui/material";

interface IProduct {
    id: string;
    title: string;
    quantity: number;
    price: number;
}

const Checkout: React.FC = () => {
    const [shippingInfo, setShippingInfo] = useState({
        fullname: "",
        address: {
            id: "",
            houseNumber: "",
            street: "",
            district: "",
            city: "",
        },
        phone: "",
    });

    const [paymentMethod, setPaymentMethod] = useState("creditCard");
    const [products, setProducts] = useState<IProduct[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // State cho hộp thoại xác nhận
    const toast = useToast();

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem("accessToken");

        try {
            const response = await fetch("http://localhost:8080/api/order/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // Assuming user is authenticated and token is stored
                },
                body: JSON.stringify({
                    shippingInfo,
                    // paymentMethod,
                    // products,
                    // totalPrice,
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to create order");
            }

            const data = await response.json();
            console.log("Order created successfully:", data);
            toast.sendToast("Success", "Mua sản phẩm thành công");
            // Handle successful order creation, e.g., navigate to order confirmation page
        } catch (error: any) {
            console.error("Error creating order:", error.message);
            setError(error.message);
            toast.sendToast("Error", "Mua sản phẩm thành công");
        }

    };

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
            const addressData = data.data;
            setShippingInfo({
                fullname: addressData.fullname,
                phone: addressData.phone,
                address: {
                    id: addressData.address.id,
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

    useEffect(() => {
        fetchDefaultAddress();
        fetchCart();
    }, []);

    const handleOpenConfirmDialog = () => {
        setOpenConfirmDialog(true); // Mở hộp thoại xác nhận
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false); // Đóng hộp thoại xác nhận
    };

    const handleConfirmOrder = async () => {
        await handleSubmit(new Event('submit')); // Chờ submit hoàn tất
        handleCloseConfirmDialog(); // Đóng hộp thoại
    };

    return (
        <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            <Typography variant="h4" sx={{ marginBottom: "20px", fontWeight: "bold" }}>
                Checkout
            </Typography>
            <Grid container spacing={3}>
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
                                    value={shippingInfo.fullname}
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
                                        <Typography>{(product.price * product.quantity).toLocaleString()} VND</Typography>
                                    </Box>
                                ))}
                                <Divider sx={{ marginBottom: "10px" }} />
                                <Typography variant="h6">Tổng cộng: {totalPrice.toLocaleString()} VND</Typography>
                            </>
                        ) : (
                            <Typography>Giỏ hàng trống</Typography>
                        )}
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ marginTop: "20px" }}
                            onClick={handleOpenConfirmDialog}
                        >
                            Đặt hàng
                        </Button>
                    </Paper>
                </Grid>
            </Grid>

            {/* Dialog Confirm */}
            <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
                <DialogContent>
                    <DialogContentText>Bạn có chắc chắn muốn đặt hàng không?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} color="primary">Hủy</Button>
                    <Button onClick={handleConfirmOrder} color="primary" autoFocus>Đặt hàng</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Checkout;
