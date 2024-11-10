"use client"
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/useToast";
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
    CircularProgress,  // Import CircularProgress
} from "@mui/material";
import AddressSelection from "@/app/(main)/checkout/AddressSelection";
import {useRouter} from "next/navigation"; // Đảm bảo AddressSelection chấp nhận chỉ id

interface IProduct {
    id: string;
    title: string;
    quantity: number;
    price: number;
}

const Checkout: React.FC = () => {
    const router = useRouter();
    const [addressId, setAddressId] = useState<string>("");  // Lưu id địa chỉ
    const [paymentMethod, setPaymentMethod] = useState("creditCard");
    const [products, setProducts] = useState<IProduct[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [orderLoading, setOrderLoading] = useState(false); // Trạng thái loading khi đặt hàng
    const toast = useToast();

    // Handle payment method change
    const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentMethod(e.target.value);
    };

    // Handle order submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem("accessToken");
        setOrderLoading(true); // Bắt đầu loading khi đặt hàng
        try {
            const response = await fetch("http://localhost:8080/api/order/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ addressId, paymentMethod }),
            });

            if (!response.ok) throw new Error("Failed to create order");

            const data = await response.json();
            console.log("Order created successfully:", data);
            toast.sendToast("Success", "Đặt hàng thành công");
            router.replace("/status-order");
        } catch (error: any) {
            console.error("Error creating order:", error.message);
            setError(error.message);
            toast.sendToast("Error", "Error creating order");
        } finally {
            setOrderLoading(false); // Dừng loading khi hoàn thành
        }
    };

    // Fetch cart items
    const fetchCart = async () => {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await fetch("http://localhost:8080/api/cart/show-cart", {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Failed to fetch cart");

            const data = await response.json();
            setProducts(data.data.cartItem.map((item: any) => ({
                id: item.product.id,
                title: item.product.title,
                quantity: item.quantity,
                price: item.product.price,
            })));
            setTotalPrice(data.data.totalPrice);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // Handle order confirmation dialog open/close
    const handleOpenConfirmDialog = () => setOpenConfirmDialog(true);
    const handleCloseConfirmDialog = () => setOpenConfirmDialog(false);

    const handleConfirmOrder = async () => {
        await handleSubmit(new Event("submit"));
        handleCloseConfirmDialog();
    };

    return (
        <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            <Typography variant="h4" sx={{ marginBottom: "20px", fontWeight: "bold" }}>
                Checkout
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    {/* AddressSelection nhận id và cập nhật addressId */}
                    <AddressSelection selectedAddressId={addressId} setSelectedAddressId={setAddressId} />

                    <Paper sx={{ padding: "20px", marginTop: "20px" }}>
                        <Typography variant="h6" sx={{ marginBottom: "10px", fontWeight: "bold" }}>
                            Payment Method
                        </Typography>
                        <RadioGroup value={paymentMethod} onChange={handlePaymentChange}>
                            <FormControlLabel value="creditCard" control={<Radio />} label="Credit/Debit Card" />
                            <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
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
                                        <Typography>{product.title} (x{product.quantity})</Typography>
                                        <Typography>{(product.price * product.quantity).toLocaleString()} VND</Typography>
                                    </Box>
                                ))}
                                <Divider sx={{ marginBottom: "10px" }} />
                                <Typography variant="h6">Total: {totalPrice.toLocaleString()} VND</Typography>
                            </>
                        ) : (
                            <Typography>Cart is empty</Typography>
                        )}
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ marginTop: "20px" }}
                            onClick={handleOpenConfirmDialog}
                        >
                            {orderLoading ? <CircularProgress size={24} color="inherit" /> : "Đặt hàng"} {/* Hiển thị spinner khi loading */}
                        </Button>
                    </Paper>
                </Grid>
            </Grid>

            {/* Confirmation Dialog */}
            <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
                <DialogContent>
                    <DialogContentText>Are you sure you want to place this order?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} color="primary">
                        Huỷ
                    </Button>
                    <Button onClick={handleConfirmOrder} color="primary" autoFocus>
                        {orderLoading ? <CircularProgress size={24} color="inherit" /> : "Đặt hàng"} {/* Hiển thị spinner khi loading */}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Checkout;
