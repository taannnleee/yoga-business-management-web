"use client";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Image from "next/image";
import { ProductByCategoryCardSkeleton } from "@/components/organisms/ProductByCategoryCard/skeleton";
import { ProductByCategoryCard } from "@/components/organisms/ProductByCategoryCard";
import { API_URL } from "@/config/url";
import { useToast } from "@/hooks/useToast";
interface IHomePageProps { }
const imageUrls = [
    "https://bizweb.dktcdn.net/100/262/937/themes/813962/assets/slider_3.jpg?1720673795720",
    "https://bizweb.dktcdn.net/100/262/937/themes/813962/assets/slider_2.jpg?1720673795720",
    "https://bizweb.dktcdn.net/100/262/937/themes/813962/assets/slider_1.jpg?1720673795720",
    "https://bizweb.dktcdn.net/100/262/937/themes/813962/assets/slider_4.jpg?1720673795720"
];

const HomePage: React.FC<IHomePageProps> = () => {
    const toast = useToast();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [categories, setCategories] = useState<any[]>([]);
    const [fetchingProducts, setFetchingProducts] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasNewOrder, setHasNewOrder] = useState<boolean>(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    const handleDotClick = (index: number) => {
        setCurrentIndex(index);
    };

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`${API_URL}/api/category/with-products`, {
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
            // Assign the fetched categories to state
            setCategories(result.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setFetchingProducts(false);
        }
    };


    useEffect(() => {
        fetchProducts();
        // Create a WebSocket client
        const stompClient = new Client({
            webSocketFactory: () => new SockJS(`${API_URL}/ws`), // WebSocket server endpoint
            debug: (msg) => console.log('STOMP Debug: ', msg),
            reconnectDelay: 5000, // Reconnect automatically after 5 seconds
        });

        stompClient.onConnect = () => {
            console.log('WebSocket connected!');
            stompClient.subscribe('/topic/notification', async (message) => {
                console.log('Received message:', message.body);
                if (!hasNewOrder) {
                    toast.sendToast("Thành công", "Có thông báo về sản phẩm mới");
                    setHasNewOrder(true); // Đánh dấu đã hiển thị thông báo
                }

            });
        };

        stompClient.onStompError = (frame) => {
            console.error('Broker error:', frame.headers['message']);
        };

        stompClient.activate();

        return () => {
            if (stompClient.active) {
                stompClient.deactivate();
            }
            console.log('WebSocket connection closed on unmount');
        };
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


            {fetchingProducts ? (
                // Show skeleton loader while fetching products
                <div>
                    <ProductByCategoryCardSkeleton /> {/* Show skeleton when fetching */}
                    <ProductByCategoryCardSkeleton />
                    <ProductByCategoryCardSkeleton />
                </div>
            ) : error ? (
                <div>Error: {error}</div>
            ) : (
                categories.map((category) => {
                    let productsToDisplay: any[] = [];
                    let count = 0;

                    // Duyệt qua từng subCategory
                    for (let i = 0; i < category.subCategories.length; i++) {
                        const subCategory = category.subCategories[i];
                        const productsInSubCategory = subCategory.products.slice(0, 8 - count);

                        productsToDisplay = [...productsToDisplay, ...productsInSubCategory];
                        count += productsInSubCategory.length;

                        if (count >= 8) {
                            break;
                        }
                    }

                    return (
                        <div key={category.id}>
                            <ProductByCategoryCard
                                category={category}
                                image={category.urlImage}
                                subCategories={category.subCategories}
                                products={productsToDisplay}
                            />
                        </div>
                    );
                })
            )}
        </>
    );
};

export default HomePage;
