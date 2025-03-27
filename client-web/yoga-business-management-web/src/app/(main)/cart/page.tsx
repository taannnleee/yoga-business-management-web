"use client";

import React, { useEffect, useState } from "react";
import {Typography, Container, Grid, CssBaseline, Button, CircularProgress, IconButton} from "@mui/material";
import ShoppingCartItem from "../../../../src/components/atom/ShoppingCartItem";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosClient";
import { API_URL } from "@/config/url";
import { FaSpinner } from "react-icons/fa";
import {MagnifyingGlassCircleIcon} from "@heroicons/react/24/solid";
import DeleteIcon from "@mui/icons-material/Delete";
import CountUp from "react-countup";

interface IProduct {
    id: string;
    title: string;
    quantity: number;
    price: number;
    variants: string;
    subCategory: string;
}

interface ICartItem {
    id: string;
    quantity: string;
    totalPrice: number;
    product: IProduct;
    currentVariant: string;
}

interface ICart {
    id: string;
    totalPrice: number;
    totalItem: number;
    cartItem: ICartItem[];
}

interface IShoppingCartPageProps { }

const ShoppingCartPage: React.FC<IShoppingCartPageProps> = () => {
    const [carts, setCarts] = useState<ICart | null>(null); // Lưu giỏ hàng
    const [loading, setLoading] = useState(true); // State để theo dõi trạng thái đang tải
    const [loadPrice, setLoadPrice] = useState(false); // State để theo dõi trạng thái đang tải
    const [error, setError] = useState<string | null>(null); // Lưu lỗi nếu có
    const router = useRouter();
    const [isMultiple, setIsMultiple] = useState(false);
// Thêm state lưu giá trị trước đó
    const [prevTotalPrice, setPrevTotalPrice] = useState(0);
    const [selectedIds, setSelectedIds] = useState([]);



    // Hàm gọi API để lấy giỏ hàng
    const fetchCart = async () => {
        try {
            const response = await axiosInstance.get(`/api/cart/show-cart`);

            const data = response.data.data;
            const { totalPrice, totalItem, cartItem } = data;

            console.log('Item:', data);

            // Chuyển đổi dữ liệu giỏ hàng vào dạng cần thiết
            const formattedCartItems = cartItem.map((item: any) => ({
                id: item.id,
                quantity: item.quantity,
                totalPrice: item.totalPrice,
                currentVariant: item.currentVariant,
                product: {
                    id: item.product.id,
                    title: item.product.title,
                    imagePath: item.product.imagePath,
                    price: item.product.price,
                    variants: item.product.variants,
                    subCategory: item.product.subCategory.name,
                },
            }));

            setCarts({ id: data.id, totalPrice, totalItem, cartItem: formattedCartItems });
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

    // Hàm xử lý khi xóa sản phẩm khỏi giỏ hàng
    const handleRemoveProduct = (productId: string) => {
        if (carts) {
            setLoadPrice(true);
            setCarts((prevCarts:any) => {
                const updatedCartItems = prevCarts.cartItem.filter((item: { product: { id: string; }; }) => item.product.id !== productId);
                return { ...prevCarts, cartItem: updatedCartItems };
            });
        }
    };
    // Hàm xoá nhiều sản phẩm khỏi giỏ hàng
    const handleDeleteMultiple = async () => {
        setLoadPrice(true);
        if (selectedIds.length === 0) return;

        try {
            setLoading(true);
            const response = await axiosInstance.post('/api/cart/remove-multiple', {
                cartItemIds: selectedIds,
            });

            console.log('Xoá thành công:', response.data);
            // Sau khi xoá gọi lại fetchCart để cập nhật danh sách
            await fetchCart();
        } catch (error) {
            console.error('Lỗi khi xoá:', error);
        } finally {
            setLoading(false);
            setLoadPrice(false);
            setSelectedIds([]); // clear sau khi xoá
        }
    };

    // Tính tổng tiền giỏ hàng
    const calculateTotalPrice = () => {
        return carts?.cartItem.reduce((total, item) => total + item.totalPrice, 0) ?? 0;
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Container fixed>
                <div className={"flex justify-between "}>
                    <Typography variant="h4" gutterBottom>
                        Giỏ hàng của bạn
                    </Typography>
                    <button>
                        <MagnifyingGlassCircleIcon className="w-10 h-10 text-gray-600 mr-1"/>
                    </button>
                    <button>
                        {!isMultiple ? (
                            <IconButton size={"small"} color="error" disabled={loading} onClick={() => setIsMultiple(true)}>
                                Xoá nhiều sản phẩm
                            </IconButton>
                        ) : (
                            <>
                                <IconButton color="error" size={"small"} disabled={loading} onClick={() => setIsMultiple(false)}>
                                    Xoá từng sản phẩm
                                </IconButton>
                                <IconButton
                                    color="error"
                                    disabled={loading || selectedIds.length === 0}
                                    onClick={handleDeleteMultiple}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </>
                        )}
                    </button>
                </div>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={7} lg={12}>
                        <Grid container spacing={3}>
                            {loading ? (
                                <Typography>Loading...</Typography>
                            ) : error ? (
                                <Typography>Error: {error}</Typography>
                            ) : carts && carts.cartItem.length > 0 ? (
                                carts.cartItem.map((cartItem) => (
                                    <Grid item xs={12} key={cartItem.id}>
                                        <ShoppingCartItem
                                            isMultiple={isMultiple}
                                            cart={carts}
                                            setPrevTotalPrice={setPrevTotalPrice}
                                            cartItem={cartItem}
                                            onRemove={handleRemoveProduct}
                                            fetchCart={fetchCart}
                                            setLoadPrice={setLoadPrice}
                                            selectedIds={selectedIds}
                                            setSelectedIds={setSelectedIds}
                                        />
                                    </Grid>

                                ))
                            ) : (
                                <Typography>No products in cart.</Typography>
                            )}
                        </Grid>

                        {/* Sticky Tổng tiền */}
                        <div className="sticky bottom-0 bg-white z-10 w-full py-4 px-4 shadow-md flex justify-end">
                            <div className="flex items-center gap-4">
                                <Typography variant="h6" gutterBottom>
                                    Tổng tiền thanh toán: {loadPrice ? (
                                    <FaSpinner className="animate-spin text-black w-6 h-6 inline-block" />
                                ) : (
                                    <CountUp
                                        start={prevTotalPrice}
                                        end={carts?.totalPrice ?? 0}
                                        duration={1.5}
                                        separator=","
                                        suffix=" đ"
                                    />
                                )}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => router.replace("/checkout")}
                                    disabled={loadPrice}
                                >
                                    Tiến hành thanh toán
                                </Button>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </React.Fragment>
    );
};

export default ShoppingCartPage;
