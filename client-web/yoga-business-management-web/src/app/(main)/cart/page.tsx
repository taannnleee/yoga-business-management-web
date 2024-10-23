"use client";

import React, { useEffect, useState } from "react";
import { Typography, Container, Grid, CssBaseline, Button } from "@mui/material";
import ShoppingCartItem from "../../../../src/components/atom/ShoppingCartItem";
import { useRouter } from 'next/navigation';

interface IProduct {
    id: string;
    title: string;
    quantity: number;
    price: number;
    subCategory: string;
}

interface IShoppingCartPageProps { }

const ShoppingCartPage: React.FC<IShoppingCartPageProps> = () => {
    const [products, setProducts] = useState<IProduct[]>([]); // State để lưu sản phẩm
    const [loading, setLoading] = useState(true); // State để theo dõi trạng thái đang tải
    const [error, setError] = useState<string | null>(null); // State để lưu lỗi nếu có
    const [totalPrice, setTotalPrice] = useState(0);
    const router = useRouter();

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
                subCategory: item.product.subCategory.name,
            }));

            setProducts(cartItems);
            setTotalPrice(data.data.totalPrice);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Gọi fetchCart khi component được mount
    useEffect(() => {
        fetchCart();
    }, []);

    const handleRemoveProduct = (productId: string) => {
        setProducts((prevProducts) =>
            prevProducts.filter((product) => product.id !== productId)
        );
        // Load lại giỏ hàng sau khi xóa sản phẩm
        fetchCart();
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Container fixed>
                <Typography variant="h4" gutterBottom>
                    Giỏ hàng của bạn
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={7} lg={12}>
                        <Grid container spacing={3}>
                            {loading ? (
                                <Typography>Loading...</Typography>
                            ) : error ? (
                                <Typography>Error: {error}</Typography>
                            ) : products.length > 0 ? (
                                products.map((product) => (
                                    <Grid item xs={12} key={product.id}>
                                        <ShoppingCartItem
                                            product={product}
                                            onRemove={handleRemoveProduct} // Truyền hàm xóa sản phẩm
                                            fetchCart={fetchCart} // Truyền hàm load lại giỏ hàng
                                        />
                                    </Grid>
                                ))
                            ) : (
                                <Typography>No products in cart.</Typography>
                            )}
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Grid container spacing={2} alignItems="center" justifyContent="flex-end">
                                <Grid item>
                                    <Typography variant="h6" gutterBottom>
                                        Tổng tiền thanh toán: {totalPrice.toLocaleString()} đ
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" color="primary" style={{ marginLeft: 16 }} onClick={() => router.replace("/checkout")}>
                                        Tiến hành thanh toán
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </React.Fragment>
    );
};

export default ShoppingCartPage;
