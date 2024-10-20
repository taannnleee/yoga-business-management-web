import React, { useState } from "react";
import { Card, CardContent, CardMedia, Typography, Button, CardActions } from "@mui/material";

// Định nghĩa interface cho product
interface Product {
    id: string;
    title: string;
    price: number;
    imagePath: string;
    averageRating: number;
    description: string;
    color: string;
    size: string;
    brand: string;
}

interface HomePageCardProps {
    product: Product; // Sử dụng interface vừa định nghĩa
}

const HomePageCard: React.FC<HomePageCardProps> = ({ product }) => {
    const [loading, setLoading] = useState(false); // Trạng thái loading khi gọi API
    const [error, setError] = useState<string | null>(null); // Trạng thái lỗi

    const addToCart = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
            const response = await fetch("http://localhost:8080/api/cart/add-to-cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // Gửi token để xác thực
                },
                body: JSON.stringify({
                    productId: product.id,
                    quantity: 1, // Thêm 1 sản phẩm vào giỏ hàng
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add product to cart");
            }

            const data = await response.json();
            console.log("Product added to cart:", data); // Log kết quả
        } catch (err: any) {
            setError(err.message); // Xử lý lỗi nếu có
        } finally {
            setLoading(false); // Dừng trạng thái loading
        }
    };

    return (
        <Card sx={{ maxWidth: 300, margin: "20px auto" }}>
            <CardMedia
                component="img"
                height="140"
                image={product.imagePath}
                alt={product.id}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {product.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    €{product.price} {/* Thêm ký hiệu tiền tệ */}
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    sx={{
                        "&:hover": {
                            backgroundColor: "primary.main",
                            color: "white"
                        }
                    }}
                >
                    Learn More
                </Button>
                <Button
                    size="small"
                    color="primary"
                    onClick={addToCart} // Gọi hàm addToCart khi nhấn vào nút
                    disabled={loading} // Vô hiệu hóa nút khi đang loading
                    sx={{
                        "&:hover": {
                            backgroundColor: "green",
                            color: "black"
                        }
                    }}
                >
                    {loading ? "Adding..." : "Add to cart"}
                </Button>

                <Button
                    size="small"
                    color="primary"
                    sx={{
                        "&:hover": {
                            backgroundColor: "green",
                            color: "black"
                        }
                    }}
                >
                    Buy now
                </Button>
            </CardActions>
            {error && <Typography color="error" sx={{ padding: "0 16px" }}>{error}</Typography>} {/* Hiển thị lỗi nếu có */}
        </Card>
    );
};

export default HomePageCard;
