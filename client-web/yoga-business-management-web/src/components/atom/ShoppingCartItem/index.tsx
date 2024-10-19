import React from "react";
import { Card, CardActions, CardContent, CardMedia, Typography, Box, Grid, IconButton, Divider } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

interface IProduct {
    id: string;
    title: string;
    quantity: number;
    price: number;
}

interface IInputProps {
    product: IProduct;
    onQuantityChange: (quantity: number) => void;
    onRemove: () => void;
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
                    {/* <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        €{product.price.toFixed(2)}
                    </Typography> */}
                    <>SubCategory</>
                </Grid>

                {/* Số lượng và nút tăng giảm */}
                <Grid item xs={2}>
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

                {/* Tổng tiền */}
                <Grid item xs={2}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        €{product.price.toFixed(2)}
                    </Typography>
                </Grid>

                {/* Nút xóa */}
                <Grid item xs={1}>
                    <IconButton onClick={onRemove} color="error">
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            </Grid>
            <Divider sx={{ marginTop: '10px' }} /> {/* Đường kẻ chia sản phẩm */}
        </Box>
    );
};

export default ShoppingCartItem;
