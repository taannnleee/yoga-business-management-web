import React, { useState } from "react";
import { Box, Typography, Button, IconButton, Divider } from "@mui/material";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const SaleoffCard: React.FC = () => {
    const products = [
        {
            id: 1,
            title: "Áo tập BRA3083 beYoga",
            originalPrice: 480000,
            salePrice: 240000,
            image: "https://bizweb.dktcdn.net/thumb/large/100/262/937/products/ao-tap-bra3083-beyoga-san-pham.jpg?v=1684827471740",
            rating: 4.2,
        },
        {
            id: 2,
            title: "Áo tập cộc tay thun tăm SRT2277 beYoga",
            originalPrice: 480000,
            salePrice: 240000,
            image: "https://bizweb.dktcdn.net/thumb/large/100/262/937/products/ao-tap-coc-tay-srt2277-beyoga-san-pham.jpg?v=1666247300583",
            rating: 4.6,
        },
        {
            id: 3,
            title: "Chai bọt xịt vệ sinh thảm yoga hàng ngày Liforme 150ml",
            originalPrice: 756000,
            salePrice: 643000,
            image: "https://bizweb.dktcdn.net/thumb/large/100/262/937/products/chai-bot-xit-ve-sinh-tham-yoga-liforme-150ml.jpg?v=1662452891750",
            rating: 3.8,
        },
        {
            id: 4,
            title: "Thảm yoga vân mây định tuyến cao su PU beYoga",
            originalPrice: 980000,
            salePrice: 784000,
            image: "https://bizweb.dktcdn.net/thumb/large/100/262/937/products/tham-yoga-van-may-dinh-tuyen-cao-su-pu.jpg?v=1654768427190",
            rating: 5.0,
        },
        {
            id: 5,
            title: "Áo thun dài tay xẻ lưng SRT1255 beYoga",
            originalPrice: 380000,
            salePrice: 342000,
            image: "https://bizweb.dktcdn.net/thumb/large/100/262/937/products/ao-dai-tay-srt1255-beyoga-san-pham.jpg?v=1637403245257",
            rating: 4.4,
        },
        {
            id: 6,
            title: "Áo thun dài tay xẻ lưng SRT1255 beYoga",
            originalPrice: 380000,
            salePrice: 342000,
            image: "https://bizweb.dktcdn.net/thumb/large/100/262/937/products/ao-dai-tay-srt1255-beyoga-san-pham.jpg?v=1637403245257",
            rating: 4.4,
        },
        {
            id: 7,
            title: "Áo thun dài tay xẻ lưng SRT1255 beYoga",
            originalPrice: 380000,
            salePrice: 342000,
            image: "https://bizweb.dktcdn.net/thumb/large/100/262/937/products/ao-dai-tay-srt1255-beyoga-san-pham.jpg?v=1637403245257",
            rating: 4.4,
        },
        {
            id: 8,
            title: "Áo thun dài tay xẻ lưng SRT1255 beYoga",
            originalPrice: 380000,
            salePrice: 342000,
            image: "https://bizweb.dktcdn.net/thumb/large/100/262/937/products/ao-dai-tay-srt1255-beyoga-san-pham.jpg?v=1637403245257",
            rating: 4.4,
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerPage = 5; // Số sản phẩm hiển thị mỗi lần

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? products.length - itemsPerPage : prevIndex - itemsPerPage));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + itemsPerPage >= products.length ? 0 : prevIndex + itemsPerPage));
    };

    const roundRating = (rating: number) => {
        return Math.round(rating * 2) / 2;
    };

    const renderStars = (rating: number) => {
        const roundedRating = roundRating(rating);
        const stars = [];

        for (let i = 0; i < 5; i++) {
            stars.push(
                <span key={i} style={{ color: i < roundedRating ? "gold" : "white" }}>
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <Box mt={2} p={2} ml={4} mr={4}>
            <Box display="flex" alignItems="center" mb={2}>
                <Box
                    sx={{
                        backgroundColor: "red",
                        width: "6px",
                        height: "30px",
                        mr: 2,
                    }}
                />
                <Typography variant="h4" fontWeight="bold" color={"red"}>
                    SALE OFF
                </Typography>
                <Button variant="contained" color="primary" sx={{ marginLeft: "auto" }}>
                    Xem tất cả
                </Button>
            </Box>

            <Divider className="my-2" />

            <Box display="flex" alignItems="center" overflow="hidden">
                <IconButton onClick={handlePrev} disabled={currentIndex === 0}>
                    <ArrowBackIosIcon />
                </IconButton>

                <Box display="flex" justifyContent="space-between" overflow="hidden" mx={2}>
                    {products.slice(currentIndex, currentIndex + itemsPerPage).map((product) => (
                        <Box
                            key={product.id}
                            position="relative"
                            mx={2}
                            className="w-64 h-86 flex flex-col items-center justify-between hover:cursor-pointer"
                        >
                            <Image
                                src={product.image}
                                alt={product.title}
                                width={218}
                                height={218}
                                layout="fixed"
                            />

                            {/* Hiệu ứng hover với nút kính lúp và button */}
                            <Box
                                className="product-hover absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out opacity-0 hover:opacity-100"
                            >
                                <IconButton
                                    color="primary"
                                    className="mb-2"
                                    style={{ marginTop: '-4px' }} // Dịch lên trên 4px
                                >
                                    <SearchIcon fontSize="large" />
                                </IconButton>
                                <Button
                                    variant="contained"
                                    className="bg-red-500 text-red w-full h-9"
                                    style={{ opacity: 1 }}
                                >
                                    Thêm vào giỏ
                                </Button>
                            </Box>

                            {/* Thông tin sản phẩm */}
                            <Box textAlign="center" mt={1}>
                                <Typography
                                    variant="subtitle1"
                                    component="a"
                                    href="#"
                                    className="no-underline cursor-pointer"
                                    style={{
                                        color: 'black',
                                        transition: 'color 0.3s',
                                        maxWidth: '192px', // Giới hạn chiều rộng là 192px
                                        display: '-webkit-box', // Hiển thị dưới dạng hộp để có thể sử dụng line-clamp
                                        WebkitLineClamp: 2, // Giới hạn tối đa 2 dòng
                                        WebkitBoxOrient: 'vertical', // Định hướng hộp là vertical
                                        overflow: 'hidden', // Ẩn phần tràn
                                        textOverflow: 'ellipsis', // Thêm dấu "..." ở cuối nếu tràn
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = 'red')}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = 'black')}
                                >
                                    {product.title}
                                </Typography>


                                <Box mt={1}>
                                    {renderStars(product.rating)}
                                </Box>
                                <Box display="flex" justifyContent="space-evenly" mt={1}>
                                    <Typography variant="body2" className="text-red-500">
                                        {product.salePrice.toLocaleString()}₫
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ textDecoration: "line-through", color: "gray" }}
                                    >
                                        {product.originalPrice.toLocaleString()}₫
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Box>

                <IconButton onClick={handleNext} disabled={currentIndex + itemsPerPage >= products.length}>
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>
        </Box>
    );
};


export default SaleoffCard;
