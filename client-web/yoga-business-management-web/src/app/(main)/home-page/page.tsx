"use client";

import Button from "@/components/atom/Button";
import Input from "@/components/atom/Input";
import { Typography, Box, Divider, CircularProgress } from "@mui/material";
import Image from "next/image";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HomePageCard from "../../../components/atom/HomePageCard";
import { Grid } from "@mui/material";
interface IHomePageProps { }

const HomePage: React.FC<IHomePageProps> = (props) => {
    const [products, setProducts] = useState<any[]>([]);
    const [fetchingProducts, setFetchingProducts] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();
    const router = useRouter();

    // Gọi API lấy sản phẩm
    useEffect(() => {
        const fetchProducts = async () => {
            try {

                const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
                const response = await fetch("http://localhost:8080/api/home/getAllProduct?page=1&size=10", {
                    method: "GET", // Đảm bảo phương thức là GET
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`, // Thêm Authorization header
                    },
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const result = await response.json();
                setProducts(result.data.content);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setFetchingProducts(false);
            }
        };
        console.log("hihi")
        fetchProducts();
    }, []);


    return (
        <>
            
            <Grid container spacing={2}>
                {fetchingProducts ? (
                    <Grid item xs={12}>
                        <Typography variant="h6">Đang tải sản phẩm...</Typography>
                    </Grid>
                ) : error ? (
                    <Grid item xs={12}>
                        <Typography variant="h6">Lỗi: {error}</Typography>
                    </Grid>
                ) : Array.isArray(products) && products.length > 0 ? (
                    products.map((product) => (
                        <Grid item xs={12} sm={6} md={3} key={product.id}>
                            <HomePageCard
                                product={{
                                    id: product.id,
                                    title: product.title,
                                    price: product.price,
                                    imagePath: product.imagePath,
                                    averageRating: product.averageRating,
                                    description: product.productDetail.description,
                                    color: product.productDetail.color,
                                    size: product.productDetail.size,
                                    brand: product.productDetail.brand,
                                }}
                            />
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Typography variant="h6">Không có sản phẩm nào.</Typography>
                    </Grid>
                )}
            </Grid>
        </>
    );
};

export default HomePage;
