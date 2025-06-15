"use client";
import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import StarIcon from "@mui/icons-material/Star";
import axiosInstance from "@/utils/axiosClient";
import { API_URL } from "@/config/url";

interface Product {
  id: number;
  imagePath: string;
  price: number;
  title: string;
  averageRating: number;
  brand: string;
  description: string;
}

interface WishListItem {
  id: number;
  product: Product;
}

const WishList: React.FC = () => {
  const [wishlist, setWishlist] = useState<WishListItem[]>([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_URL}/api/wishlist/get-wishlist-of-user`
        );
        if (response.status === 200) {
          setWishlist(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (id: number) => {
    try {
      const response = await axiosInstance.delete(
        `${API_URL}/api/wishlist/delete-wishlist-of-user/${id}`
      );
      if (response.status === 200) {
        setWishlist(wishlist.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Saved items ({wishlist.length})
      </Typography>
      <Grid container spacing={3}>
        {wishlist.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 2,
                p: 1,
                bgcolor: "#fafafa",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: 320,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  bgcolor: "#f5f5f5",
                  borderRadius: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 140,
                  mb: 2,
                }}
              >
                <CardMedia
                  component="img"
                  image={item.product.imagePath}
                  alt={item.product.title}
                  sx={{
                    maxHeight: 120,
                    maxWidth: "90%",
                    objectFit: "contain",
                  }}
                />
              </Box>
              <CardContent sx={{ width: "100%", p: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    mb: 1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={item.product.title}
                >
                  {item.product.title}
                </Typography>
                {item.product.averageRating > 0 && (
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <StarIcon
                        key={idx}
                        fontSize="small"
                        sx={{
                          color:
                            idx < Math.round(item.product.averageRating)
                              ? "#fbc02d"
                              : "#e0e0e0",
                        }}
                      />
                    ))}
                  </Box>
                )}
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#222", mb: 1 }}
                >
                  {item.product.price.toLocaleString("vi-VN")}đ
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Tooltip title="Remove from wishlist">
                    <IconButton
                      onClick={() => removeFromWishlist(item.id)}
                      color="error"
                      sx={{
                        bgcolor: "#f5f5f5",
                        borderRadius: 2,
                        "&:hover": { bgcolor: "#ffeaea" },
                      }}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WishList;
