import React, { useState } from "react";
import { Card, CardActions, CardContent, CardMedia, Typography, Box, Grid, IconButton, Divider } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

interface IProduct {
    id: string;
    title: string;
    quantity: number;
    price: number;
    subCategory: string;
}

interface IInputProps {
    product: IProduct;
}

const ShoppingCartItem: React.FC<IInputProps> = ({ product }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleIncrease = async () => {
        console.log('Đã tăng số lượng sản phẩm:', product.id);
        setLoading(true);
        setError(null); // Reset error before making the request

        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch("http://localhost:8080/api/cart/add-to-cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productId: product.id, // Thay đổi theo yêu cầu của bạn
                    quantity: product.quantity + 1,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add product to cart");
            }

            const data = await response.json();
            console.log(data); // Thực hiện hành động gì đó với phản hồi nếu cần
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDecrease = () => {
        if (product.quantity > 1) {
            console.log('Đã giảm số lượng sản phẩm:', product.id);
            // Gọi API tương tự như handleIncrease nếu cần
        }
    };

    return (
        <Box sx={{ padding: '10px 0', width: '1200px' }}>
            <Grid container alignItems="center" spacing={2}>
                {/* Hình ảnh sản phẩm */}
                <Grid item xs={2}>
                    <CardMedia
                        component="img"
                        sx={{ width: 100 }}
                        image="https://bizweb.dktcdn.net/100/262/937/themes/813962/assets/slider_3.jpg?1720673795720"
                        title={product.title}
                    />
                </Grid>

                {/* Tiêu đề sản phẩm */}
                <Grid item xs={2}>
                    <Typography sx={{ fontWeight: 'bold' }}>{product.title}</Typography>
                    <Typography variant="body2" color="textSecondary">5.4-inch display</Typography>
                </Grid>

                {/* Giá sản phẩm */}
                <Grid item xs={2}>
                    <Typography>
                        {product.subCategory}
                    </Typography>
                </Grid>

                {/* Số lượng và nút tăng giảm */}
                <Grid item xs={2}>
                    <Box display="flex" alignItems="center">
                        <IconButton onClick={handleDecrease}>
                            <RemoveIcon />
                        </IconButton>
                        <Typography variant="body1">{product.quantity}</Typography>
                        <IconButton onClick={handleIncrease} disabled={loading}>
                            <AddIcon />
                        </IconButton>
                    </Box>
                    {loading && <Typography variant="body2">Loading...</Typography>}
                    {error && <Typography color="error">{error}</Typography>}
                </Grid>

                {/* Tổng tiền */}
                <Grid item xs={2}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        €{product.price.toFixed(2)}
                    </Typography>
                </Grid>

                {/* Nút xóa */}
                <Grid item xs={1}>
                    <IconButton color="error">
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            </Grid>
            <Divider sx={{ marginTop: '10px' }} /> {/* Đường kẻ chia sản phẩm */}
        </Box>
    );
};

export default ShoppingCartItem;
