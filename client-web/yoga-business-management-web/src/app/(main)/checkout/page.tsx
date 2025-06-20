"use client";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/useToast";
import { Select, MenuItem, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { API_URL } from "@/config/url";
import axiosInstance from "@/utils/axiosClient";
import {
    Box,
    Typography,
    Grid,
    Paper,
    Divider,
    FormControlLabel,
    Radio,
    RadioGroup,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    CircularProgress, // Import CircularProgress
} from "@mui/material";
import AddressSelection from "@/app/(main)/checkout/AddressSelection";
import { useRouter } from "next/navigation";
import PromotionSelection from "./PromotionSelection";

interface IProduct {
    id: string;
    title: string;
    quantity: number;
    price: number;
    currentVariant: any;
}
interface IPromotion {
    id: string;
    code: string;
    discount: number;
    discountType: string;
    startDate: string;
    expiryDate: string;
}

const Checkout: React.FC = () => {
    const [isAddressValid, setIsAddressValid] = useState(true);
    const router = useRouter();
    const [addressId, setAddressId] = useState<string>(""); // Lưu id địa chỉ
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [products, setProducts] = useState<IProduct[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [orderLoading, setOrderLoading] = useState(false); // Trạng thái loading khi đặt hàng
    const toast = useToast();
    const [totalPricePromotion, setTotalPricePromotion] = useState(0);

    const [selectedPromotion, setSelectedPromotion] = useState<IPromotion | null>(null);

    // Hàm kiểm tra tính hợp lệ của địa chỉ
    const handleAddressValidation = (isValid: boolean) => {
        setIsAddressValid(isValid);
    };

    const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentMethod(e.target.value);
    };

    const fetchCart = async () => {
        try {
            const response = await axiosInstance.get(`${API_URL}/api/cart/show-cart`,

            );


            setProducts(response.data.data.cartItem.map((item: any) => ({
                id: item.product.id,
                title: item.product.title,
                quantity: item.quantity,
                price: item.product.price,
                currentVariant: item.currentVariant,
            })));
            setTotalPrice(response.data.data.totalPrice);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentVNPay = async () => {
        setOrderLoading(true);
        // Prepare the order data to send with the payment request
        const orderData = {
            addressId,
            paymentMethod,
            // products: products.map((product) => ({
            //     id: product.id,
            //     quantity: product.quantity,
            //     variant: product.currentVariant,
            // })),
        };

        try {
            // Send the request to initiate the VNPay payment and include the order data
            const response = await axiosInstance.post(
                `${API_URL}/api/payment/vn-pay`,
                orderData,
                {
                    params: {
                        amount: totalPricePromotion,
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
            setOrderLoading(false);
            // Redirect to the payment URL
            router.push(paymentUrl);
        } catch (error: any) {
            console.error("Error initiating VNPay payment:", error.message);
            setError(error.message);
            toast.sendToast("Error", "Error initiating VNPay payment", "error");
        }
    };


    const handleSubmit = async () => {
        // e.preventDefault();

        if (paymentMethod === "vnpay") {
            await handlePaymentVNPay();
        } else {
            await createOrder();
        }
    };

    const createOrder = async () => {
        setOrderLoading(true);
        try {
            const response = await axiosInstance.post(
                `${API_URL}/api/order/create-order`,
                {
                    totalPricePromotion,
                    addressId,
                    paymentMethod,
                    products: products.map((product) => ({
                        id: product.id,
                        quantity: product.quantity,
                        variant: product.currentVariant,
                    })),
                }
            );

            toast.sendToast("Success", "Đặt hàng thành công");
            router.replace("/status-order");
        } catch (error: any) {
            console.error("Error creating order:", error.message);
            setError(error.message);
            toast.sendToast("Error", "Error creating order", "error");
        } finally {
            setOrderLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleOpenConfirmDialog = () => setOpenConfirmDialog(true);
    const handleCloseConfirmDialog = () => setOpenConfirmDialog(false);

    const handleConfirmOrder = async () => {
        await handleSubmit();
        handleCloseConfirmDialog();
    };
    const removePromotion = () => {
        setSelectedPromotion(null); // Xóa mã giảm giá
        setTotalPricePromotion(totalPrice); // Trở về giá gốc
    };

    return (
        <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            <Typography variant="h4" sx={{ marginBottom: "20px", fontWeight: "bold" }}>
                Checkout
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <AddressSelection
                        addressId={addressId}
                        setSelectedAddressId={setAddressId}
                        loading={loading}
                        setIsAddressValid={handleAddressValidation}

                    />
                    <Paper sx={{ padding: "20px", marginTop: "20px" }}>
                        <Typography variant="h6" sx={{ marginBottom: "10px", fontWeight: "bold" }}>
                            Payment Method
                        </Typography>
                        <RadioGroup value={paymentMethod} onChange={handlePaymentChange}>
                            {/* <FormControlLabel value="creditCard" control={<Radio />} label="Credit/Debit Card" /> */}
                            <FormControlLabel value="vnpay" control={<Radio />} label="VNPAY" />
                            {/* <FormControlLabel value="paypal" control={<Radio />} label="PayPal" /> */}
                            <FormControlLabel value="cash" control={<Radio />} label="Cash on Delivery (COD)" />
                        </RadioGroup>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>

                    <Paper sx={{ padding: "20px" }}>
                        <Typography variant="h6" sx={{ marginBottom: "10px", fontWeight: "bold" }}>
                            Order Summary
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

                                        <Typography>
                                            {product.title} (x{product.quantity})
                                        </Typography>
                                        <Typography>{(product.price * product.quantity).toLocaleString()} VND</Typography>
                                    </Box>
                                ))}
                                <Divider sx={{ marginBottom: "10px" }} />
                                <Typography variant="h6" className={"line-through"}>Giá gốc: {totalPrice.toLocaleString()} VND</Typography>
                                <Typography variant="h6">Giá hiện tại: {totalPricePromotion.toLocaleString()} VND</Typography>
                                <Typography>
                                    Giảm giá: {selectedPromotion?.discount} % / Tổng giá trị
                                    {selectedPromotion && (
                                        <IconButton onClick={removePromotion} sx={{ marginLeft: "10px", color: "red" }}>
                                            <CloseIcon />
                                        </IconButton>
                                    )}
                                    <PromotionSelection
                                        totalPrice={totalPrice}
                                        setTotalPricePromotion={setTotalPricePromotion}
                                        setSelectedPromotion={setSelectedPromotion}
                                    />
                                </Typography>

                            </>
                        ) : (
                            <Typography>Cart is empty</Typography>
                        )}

                        <Button disabled={!isAddressValid}
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ marginTop: "20px" }}
                            onClick={handleOpenConfirmDialog}
                        >
                            {orderLoading ? <CircularProgress size={24} color="inherit" /> : "Thanh toán"}
                        </Button>
                    </Paper>

                </Grid>
            </Grid>

            <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
                <DialogContent>
                    <DialogContentText>Are you sure you want to place this order?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} color="primary">
                        Huỷ
                    </Button>
                    <Button onClick={handleConfirmOrder} color="primary" autoFocus>
                        {orderLoading ? <CircularProgress size={24} color="inherit" /> : "Thanh toán"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Checkout;
