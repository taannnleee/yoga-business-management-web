"use client";

import React, { useEffect, useState } from "react";
import { Typography, Container, Grid, CssBaseline } from "@mui/material";
import ShoppingCartItem from "../../../../src/components/atom/ShoppingCartItem";

interface IProduct {
    id: string;
    title: string;
    quantity: number;
    price: number;
    subCategory: string;
}

interface IShoppingCartPageProps {
}

const ShoppingCartPage: React.FC<IShoppingCartPageProps> = () => {
    const [products, setProducts] = useState<IProduct[]>([]); // State để lưu sản phẩm
    const [loading, setLoading] = useState(true); // State để theo dõi trạng thái đang tải
    const [error, setError] = useState<string | null>(null); // State để lưu lỗi nếu có


    // Gọi API lấy giỏ hàng
    useEffect(() => {
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
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    return (
        <React.Fragment>
            <CssBaseline />
            <Container fixed>
                <Typography variant="h4" gutterBottom>
                    Your Shopping Cart
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={7} lg={7}>
                        <Grid container spacing={2}>
                            {loading ? (
                                <Typography>Loading...</Typography>
                            ) : error ? (
                                <Typography>Error: {error}</Typography>
                            ) : products.length > 0 ? (
                                products.map((product) => (
                                    <Grid item xs={12} key={product.id}>
                                        <ShoppingCartItem
                                            product={product}
                                            
                                        />
                                    </Grid>
                                ))
                            ) : (
                                <Typography>No products in cart.</Typography>
                            )}
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6} md={5} lg={5}>
                        {/* Tổng tiền và nút thanh toán có thể đặt ở đây */}
                    </Grid>
                </Grid>
            </Container>
        </React.Fragment>
    );
};

export default ShoppingCartPage;
