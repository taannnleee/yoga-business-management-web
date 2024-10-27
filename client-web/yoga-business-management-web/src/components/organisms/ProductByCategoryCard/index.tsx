import React, { useState } from "react";
import {Box, Typography, Button, IconButton, Divider, Grid, Dialog, DialogContent} from "@mui/material";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput';
import {CustomNumberInput} from "@/components/atom/CustomNumberInput";
import {useRouter} from "next/navigation";

const ProductByCategoryCard: React.FC = () => {
    const router = useRouter();
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
        // More products...
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [open, setOpen] = useState(false);
    const itemsPerPage = 8; // 2 hàng, mỗi hàng 4 sản phẩm
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? products.length - itemsPerPage : prevIndex - itemsPerPage));
    };
    const handleCloseModal = () => {
        setOpen(false); // Close modal
    };
    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + itemsPerPage >= products.length ? 0 : prevIndex + itemsPerPage));
    };

    const roundRating = (rating: number) => {
        return Math.round(rating * 2) / 2;
    };
    const handleOpenModal = (product: any) => {
        setSelectedProduct(product); // Set the selected product
        setOpen(true); // Open modal
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
        <Box mt={2} p={2} ml={4} mr={4} display="flex">
            {/* Phần bên trái - Ảnh category */}


            {/* Phần bên phải - Sản phẩm */}
            <Box flex={1}>
                <Box display="flex" alignItems="center" mb={2}>
                    <Box
                        sx={{
                            backgroundColor: "red",
                            width: "6px",
                            height: "30px",
                            mr: 2,
                        }}
                    />
                    <Typography variant="h4" fontWeight="bold" color={"red"} mr={2}>
                        THẢM TẬP YOGA
                    </Typography>

                    <Box display="flex" alignItems="center" className={"mx-auto"}>
                        <Typography variant="body1" component="a" href="#" style={{ marginRight: 20, cursor: "pointer" }}>
                            Phổ thông
                        </Typography>
                        <Typography variant="body1" component="a" href="#" style={{ marginRight: 20, cursor: "pointer" }}>
                            Du lịch
                        </Typography>
                        <Typography variant="body1" component="a" href="#" style={{ marginRight: 20, cursor: "pointer" }}>
                            Định tuyến
                        </Typography>
                        <Typography variant="body1" component="a" href="#" style={{ marginRight: 20, cursor: "pointer" }}>
                            Khăn Túi & Dây đeo
                        </Typography>
                        <Typography variant="body1" component="a" href="#" style={{ marginRight: 20, cursor: "pointer" }}>
                            Nước lau
                        </Typography>
                    </Box>

                    <Button variant="contained" color="primary" sx={{ marginLeft: "auto" }}>
                        Xem tất cả
                    </Button>
                </Box>

                <Divider className="my-2" />
                <div className={"flex items-center justify-center py-2"}>
                    <Box width="540px" height="634px" mr={2} mt={-2}>
                        <Image
                            src="https://bizweb.dktcdn.net/100/262/937/themes/813962/assets/collection_4_banner.jpg?1720673795720"
                            alt="Category Image"
                            width={240}
                            height={634}
                            layout="fixed"
                        />
                    </Box>
                    {/* Carousel với 8 sản phẩm */}
                    <Box display="flex" alignItems="center" className={"ml-[-64px]"}>
                        <IconButton onClick={handlePrev} disabled={currentIndex === 0}>
                        </IconButton>

                        <Grid container spacing={2} mx={2}>
                            {products.slice(currentIndex, currentIndex + itemsPerPage).map((product) => (
                                <Grid item xs={3} key={product.id}>
                                    <Box
                                        position="relative"
                                        className="w-64 h-86 flex flex-col items-center justify-between hover:cursor-pointer"
                                    >
                                        <Image
                                            src={product.image}
                                            alt={product.title}
                                            width={218}
                                            height={218}
                                            layout="fixed"
                                        />

                                        <Box
                                            className="product-hover absolute left-0 w-full h-full flex flex-col justify-center items-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out opacity-0 hover:opacity-100"
                                        >
                                            <IconButton color="secondary" className=" top-[-41px]" onClick={() => handleOpenModal(product)}>
                                                <SearchIcon fontSize="large" className={"hover:bg-red-500 rounded-full w-[46px]"}/>
                                            </IconButton>

                                            <Button variant="contained" className="bg-red-500 w-full h-9"
                                                        onClick={() => router.push(`/product-detail/${product.id}`)}
                                                >
                                                    Xem chi tiết
                                            </Button>

                                        </Box>

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
                                                    {product.originalPrice.toLocaleString()}₫
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>

                        <IconButton onClick={handleNext} disabled={currentIndex + itemsPerPage >= products.length}>
                        </IconButton>
                    </Box>
                </div>

            </Box>
            {/* Modal for product details */}
            <Dialog open={open} onClose={handleCloseModal} maxWidth="lg">
                <DialogContent>
                    <Box display="flex" width="990px" height="366px">
                        {/* Left - Image */}
                        <Box flex={1}>
                            <Image
                                src={selectedProduct?.image || ""}
                                alt={selectedProduct?.title || ""}
                                width={390}
                                height={390}
                                layout="fixed"
                            />
                        </Box>
                        {/* Right - Product details */}
                        <Box flex={2} ml={2}>
                            <Typography variant="h6" fontWeight="bold">{selectedProduct?.title}</Typography>
                            <Typography variant="subtitle1" className={" py-2 flex items-center space-x-4"}>
                                <div>Thương hiệu:
                                    <span className={"text-red-500"}> beYoga </span>
                                </div>
                                <div>Tình trạng:
                                    <span className={"text-red-500"}> Còn hàng</span>
                                </div>

                            </Typography>
                            <Typography className={"py-4"} variant="h5" color="red">{selectedProduct?.originalPrice?.toLocaleString()}₫</Typography>
                            <Typography
                                variant="body2"
                                component="a"
                                href="#"
                                className="no-underline"
                                style={{
                                    color: 'black',
                                    transition: 'color 0.3s',
                                    maxWidth: '660px', // Giới hạn chiều rộng là 192px
                                    display: '-webkit-box', // Hiển thị dưới dạng hộp để có thể sử dụng line-clamp
                                    WebkitLineClamp: 3, // Giới hạn tối đa 2 dòng
                                    WebkitBoxOrient: 'vertical', // Định hướng hộp là vertical
                                    overflow: 'hidden', // Ẩn phần tràn
                                    textOverflow: 'ellipsis', // Thêm dấu "..." ở cuối nếu tràn
                                }}
                            >
                                Mẫu áo tập tanktop TNK4111 beYoga là một thiết kế đậm chất nữ tính với điểm nhấn ở phần dây buộc phía sau lưng.
                                Áo sử dụng chất liệu thun mịn, mềm, mát, siêu co giãn và được tích hợp sẵn bra bên trong với miếng lót ngực dễ dàng tháo lắp.
                                Áo tập này phù hợp cho đa dạng loại hình tập luyện, từ yoga, gym, fitness, pickleball, cầu lông... cho đến chạy bộ, đạp xe, dạo phố...
                                CHI TIẾT SẢN PHẨM: Chất liệu: 81% Nylon & 19% Spandex...
                            </Typography>
                            <Typography variant="body2" className="text-red-500 py-2 cursor-pointer"
                            onClick={() => router.push(`/product-detail/${selectedProduct.id}`)}
                            >
                                Xem chi tiết
                            </Typography>
                            <div className={"flex items-center justify-start space-x-4"}>
                                <CustomNumberInput aria-label="Demo number input" placeholder="Nhập số lượng…" />

                                <Button variant="contained" className="bg-red-500 w-48 h-12">
                                    Thêm vào giỏ
                                </Button>
                            </div>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>

    );
};

export default ProductByCategoryCard;
