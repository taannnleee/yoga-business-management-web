"use client";
import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Typography, Box, Grid, IconButton } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove"; // Thêm icon xóa sản phẩm
import AddIcon from "@mui/icons-material/Add"; // Thêm icon thêm số lượng

interface IProduct {
    id: string;
    title: string;
    quantity: number;
    price: number;
}

interface IInputProps {
    product: IProduct;
    onQuantityChange: (quantity: number) => void; // Hàm để cập nhật số lượng
    onRemove: () => void; // Hàm để xóa sản phẩm khỏi giỏ hàng
}

const ShoppingCartItem: React.FC<IInputProps> = ({ product, onQuantityChange, onRemove }) => {
    const handleIncrease = () => {
        onQuantityChange(product.quantity + 1);
    };

    const handleDecrease = () => {
        if (product.quantity > 1) {
            onQuantityChange(product.quantity - 1);
        }
    };

    return (
        <Card sx={{ display: 'flex', margin: '20px' }}>
            <CardMedia
                sx={{ width: 150 }}
                image="https://source.unsplash.com/random" // Bạn có thể thay đổi hình ảnh sản phẩm
                title={product.title}
            />
            <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography sx={{ fontWeight: 'bold' }} color="textSecondary" gutterBottom>
                    {product.title}
                </Typography>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Typography variant="body1">Quantity: {product.quantity}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            Price: €{product.price.toFixed(2)}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="flex" alignItems="center">
                            <IconButton onClick={handleDecrease}>
                                <RemoveIcon />
                            </IconButton>
                            <Typography variant="body1">{product.quantity}</Typography>
                            <IconButton onClick={handleIncrease}>
                                <AddIcon />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>
                <IconButton onClick={onRemove} color="secondary">
                    Remove
                </IconButton>
            </CardActions>
        </Card>
    );
};
export default ShoppingCartItem;
