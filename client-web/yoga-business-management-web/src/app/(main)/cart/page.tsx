"use client";

import React, { useEffect, useState } from "react";
import {
  Typography,
  Container,
  Grid,
  CssBaseline,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import ShoppingCartItem from "../../../../src/components/atom/ShoppingCartItem";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosClient";
import { API_URL } from "@/config/url";
import { FaSpinner } from "react-icons/fa";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CountUp from "react-countup";

interface IProduct {
  id: string;
  title: string;
  quantity: number;
  price: number;
  variants: string;
  subCategory: string;
  imagePath: string;
}

interface ICartItem {
  id: string;
  quantity: number;
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

interface IShoppingCartPageProps {}

const ShoppingCartPage: React.FC<IShoppingCartPageProps> = () => {
  const [carts, setCarts] = useState<ICart | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadPrice, setLoadPrice] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isMultiple, setIsMultiple] = useState(false);
  const [prevTotalPrice, setPrevTotalPrice] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchCart = async () => {
    try {
      const response = await axiosInstance.get(`/api/cart/show-cart`);
      const data = response.data.data;
      const { totalPrice, totalItem, cartItem } = data;

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

      setCarts({
        id: data.id,
        totalPrice,
        totalItem,
        cartItem: formattedCartItems,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemoveProduct = (productId: string) => {
    if (carts) {
      setLoadPrice(true);
      setCarts((prevCarts: any) => {
        const updatedCartItems = prevCarts.cartItem.filter(
          (item: { product: { id: string } }) => item.product.id !== productId
        );
        return { ...prevCarts, cartItem: updatedCartItems };
      });
    }
  };

  const handleDeleteMultiple = async () => {
    setLoadPrice(true);
    if (selectedIds.length === 0) return;

    try {
      setLoading(true);
      const response = await axiosInstance.post("/api/cart/remove-multiple", {
        cartItemIds: selectedIds,
      });

      await fetchCart();
    } catch (error) {
      console.error("Lỗi khi xoá:", error);
    } finally {
      setLoading(false);
      setLoadPrice(false);
      setSelectedIds([]);
    }
  };

  const calculateTotalPrice = () => {
    return (
      carts?.cartItem.reduce((total, item) => total + item.totalPrice, 0) ?? 0
    );
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container fixed>
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h4" gutterBottom>
            Giỏ hàng của bạn
          </Typography>
          <div>
            {!isMultiple ? (
              <IconButton
                size="small"
                color="error"
                disabled={loading}
                onClick={() => setIsMultiple(true)}
              >
                Xoá nhiều sản phẩm
              </IconButton>
            ) : (
              <>
                <IconButton
                  color="error"
                  size="small"
                  disabled={loading}
                  onClick={() => setIsMultiple(false)}
                >
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
          </div>
        </div>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={7} lg={12}>
            <Grid container spacing={3}>
              {loading ? (
                <Grid item xs={12} className="flex justify-center py-12">
                  <CircularProgress />
                </Grid>
              ) : error ? (
                <Grid item xs={12} className="flex justify-center py-12">
                  <Typography color="error">Error: {error}</Typography>
                </Grid>
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
                <Grid item xs={12}>
                  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-md">
                    <ShoppingCartIcon
                      style={{ fontSize: 64, color: "#bdbdbd" }}
                    />
                    <Typography
                      variant="h6"
                      className="mt-4 mb-2 text-gray-700"
                    >
                      Bạn không có sản phẩm nào trong giỏ hàng
                    </Typography>
                    <Typography variant="body2" className="mb-6 text-gray-500">
                      Hãy mua sắm để trải nghiệm những sản phẩm tuyệt vời!
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={() => router.replace("/home")}
                    >
                      Mua sắm ngay
                    </Button>
                  </div>
                </Grid>
              )}
            </Grid>

            {/* Sticky Tổng tiền */}
            {carts && carts.cartItem.length > 0 && (
              <div className="sticky bottom-0 bg-white z-10 w-full py-4 px-4 shadow-md flex justify-end">
                <div className="flex items-center gap-4">
                  <Typography variant="h6" gutterBottom>
                    Tổng tiền thanh toán:{" "}
                    {loadPrice ? (
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
                    Tiến hành đặt hàng
                  </Button>
                </div>
              </div>
            )}
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};

export default ShoppingCartPage;
