import React, { useState, useEffect } from "react";
import { CardMedia, Typography, Box, Grid, IconButton, Divider } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import useDebounce from "../../../hooks/useDebounce"; // Hook debounce

interface IProduct {
    id: string;
    title: string;
    quantity: number;
    price: number;
    subCategory: string;
}

interface IInputProps {
    product: IProduct;
    onRemove: (productId: string) => void;
}

const ShoppingCartItem: React.FC<IInputProps> = ({ product, onRemove }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(product.quantity); // Tổng số lượng hiện tại
    const [changedQuantity, setChangedQuantity] = useState(0); // Số lượng thay đổi
    const debouncedChangedQuantity = useDebounce(changedQuantity, 1000); // Debounce số lượng thay đổi

    useEffect(() => {
        const updateCart = async () => {
            if (debouncedChangedQuantity > 0) { // Chỉ gọi API khi số lượng tăng
                console.log('Tăng số lượng sản phẩm:', product.id, debouncedChangedQuantity);
                setLoading(true);
                setError(null);

                try {
                    const token = localStorage.getItem("accessToken");
                    const response = await fetch("http://localhost:8080/api/cart/add-to-cart", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            productId: product.id,
                            quantity: debouncedChangedQuantity, // Gửi số lượng đã thay đổi (tăng)
                        }),
                    });

                    if (!response.ok) {
                        throw new Error("Failed to increase product quantity");
                    }

                    const data = await response.json();
                    console.log(data);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                    setChangedQuantity(0); // Reset số lượng thay đổi sau khi cập nhật
                }
            } else if (debouncedChangedQuantity < 0) { // Chỉ gọi API khi số lượng giảm
                console.log('Giảm số lượng sản phẩm:', product.id, debouncedChangedQuantity);
                setLoading(true);
                setError(null);

                try {
                    const token = localStorage.getItem("accessToken");
                    const response = await fetch("http://localhost:8080/api/cart/subtract-from-cart-item", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            productId: product.id,
                            quantity: Math.abs(debouncedChangedQuantity), // Gửi số lượng đã thay đổi (giảm)
                        }),
                    });

                    if (!response.ok) {
                        throw new Error("Failed to decrease product quantity");
                    }

                    const data = await response.json();
                    console.log(data);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                    setChangedQuantity(0); // Reset số lượng thay đổi sau khi cập nhật
                }
            }
        };

        updateCart(); // Gọi hàm cập nhật khi debouncedChangedQuantity thay đổi
    }, [debouncedChangedQuantity, product.id]);

    const handleIncrease = () => {
        setQuantity((prevQuantity) => prevQuantity + 1); // Tăng tổng số lượng
        setChangedQuantity((prevChanged) => prevChanged + 1); // Tăng số lượng thay đổi
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity((prevQuantity) => prevQuantity - 1); // Giảm tổng số lượng
            setChangedQuantity((prevChanged) => prevChanged - 1); // Giảm số lượng thay đổi
        }
    };

    // Hàm xử lý khi nhấn vào nút xóa sản phẩm
    const handleDelete = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch("http://localhost:8080/api/cart/remove-from-cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productId: product.id, // Gửi productId để xóa sản phẩm
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to remove product from cart");
            }

            const data = await response.json();
            console.log(data);

            // Gọi hàm onRemove để cập nhật lại giỏ hàng
            onRemove(product.id);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
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
                    <Typography>{product.subCategory}</Typography>
                </Grid>

                {/* Số lượng và nút tăng giảm */}
                <Grid item xs={2}>
                    <Box display="flex" alignItems="center">
                        <IconButton onClick={handleDecrease}>
                            <RemoveIcon />
                        </IconButton>
                        <Typography variant="body1">{quantity}</Typography>
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
                        {(quantity * product.price).toLocaleString('vi-VN')} đ {/* Định dạng số tiền với dấu '.' cách 3 số */}
                    </Typography>
                </Grid>

                {/* Nút xóa */}
                <Grid item xs={1}>
                    <IconButton color="error" onClick={handleDelete} disabled={loading}>
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            </Grid>
            <Divider sx={{ marginTop: '10px' }} /> {/* Đường kẻ chia sản phẩm */}
        </Box>
    );
};

export default ShoppingCartItem;
