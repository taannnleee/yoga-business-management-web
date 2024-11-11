"use client";

import Button from "@/components/atom/Button";
import Input from "@/components/atom/Input";
import { Typography, Box, Divider, CircularProgress } from "@mui/material";
import Image from "next/image";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation"; // Make sure you're importing from 'next/navigation'
import Link from "next/link";
import HomePageCard from "../../../components/molecules/HomePageCard";
import { Grid } from "@mui/material";
import SaleoffCard from "@/components/organisms/SaleOffCard";
import ProductByCategoryCard from "@/components/organisms/ProductByCategoryCard";

interface IHomePageProps {}

const imageUrls = [
    "https://bizweb.dktcdn.net/100/262/937/themes/813962/assets/slider_3.jpg?1720673795720",
    "https://bizweb.dktcdn.net/100/262/937/themes/813962/assets/slider_2.jpg?1720673795720",
    "https://bizweb.dktcdn.net/100/262/937/themes/813962/assets/slider_1.jpg?1720673795720",
    "https://bizweb.dktcdn.net/100/262/937/themes/813962/assets/slider_4.jpg?1720673795720"
];

const HomePage: React.FC<IHomePageProps> = (props) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [products, setProducts] = useState<any[]>([]);
    const [fetchingProducts, setFetchingProducts] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    const handleDotClick = (index: number) => {
        setCurrentIndex(index);
    };

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await fetch("http://localhost:8080/api/product/all?page=1&size=10", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
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

        fetchProducts();
    }, []);

    return (
        <>

            <Box sx={{
                position: "relative",
                height: "482px",
                width: "100%",
                overflow: "hidden",
                mb: 2,
            }}>
                {imageUrls.map((url, index) => (
                    <Box key={index} sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        opacity: index === currentIndex ? 1 : 0,
                        transition: "opacity 1s ease",
                    }}>
                        <Image src={url} alt={`Banner Image ${index + 1}`} layout="fill" objectFit="cover" />
                    </Box>
                ))}

                <Box sx={{
                    position: "absolute",
                    bottom: "20px",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                }}>
                    {imageUrls.map((_, index) => (
                        <Box key={index} onClick={() => handleDotClick(index)} sx={{
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            backgroundColor: index === currentIndex ? "white" : "rgba(255, 255, 255, 0.5)",
                            cursor: "pointer",
                            transition: "background-color 0.3s ease",
                        }} />
                    ))}
                </Box>
            </Box>
            <SaleoffCard/>
            <ProductByCategoryCard products={products}/>
        </>
    );
};

export default HomePage;
