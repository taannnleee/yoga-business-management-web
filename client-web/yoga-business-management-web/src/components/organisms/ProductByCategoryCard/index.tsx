import React, { useState, useEffect } from "react";
import { Box, Typography, Button, IconButton, Divider, Dialog, DialogContent, Skeleton } from "@mui/material";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CustomNumberInput } from "@/components/atom/CustomNumberInput";
import {toast} from "react-toastify";
import {useToast} from "@/hooks/useToast"; // Import axios

interface ProductByCategoryCardProps {
    products: any[];
}

const ProductByCategoryCard: React.FC<ProductByCategoryCardProps> = ({ products }) => {
    const toast = useToast();
    const [quantity, setQuantity] = useState(1);
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const handleQuantityChange = (e) => {
        setQuantity(e.target.value); // Cập nhật giá trị khi người dùng thay đổi
    };
    const itemsPerPage = 8;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch products or any data if necessary
                setLoading(true);
                // Simulate API delay
                setTimeout(() => {
                    setLoading(false); // Set loading false once data is loaded
                }, 4000); // Adjust this time as necessary
            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        };

        fetchProducts();
    }, []);

    const handleAddToCart = async () => {
        try {
            const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
            const response = await fetch("http://localhost:8080/api/cart/add-to-cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // Gửi token để xác thực
                },
                body: JSON.stringify({
                    productId: selectedProduct.id, // Truyền product.id vào API
                    quantity: quantity, // Sử dụng giá trị quantity từ state
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add product to cart");
            }

            const data = await response.json();
            console.log("Product added to cart:", data); // Log kết quả
            toast.sendToast("Thành công", "Đã thêm sản phẩm vào giỏ hàng");
            setOpen(false);
        } catch (err: any) {
            console.error("Error adding product to cart:", err.message); // Xử lý lỗi nếu có
        }
    };
    const handleOpenModal = async (product: any) => {
        try {
            const token = localStorage.getItem("accessToken"); // Get accessToken from localStorage
            if (!token) {
                // Handle case if there's no token
                console.error("Access token is missing.");
                return;
            }

            const response = await axios.get(`http://localhost:8080/api/product-detail/getProduct/${product.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                // Update the modal with the fetched product details
                setSelectedProduct(response.data.data);
                setOpen(true);
            } else {
                console.error("Failed to fetch product details");
            }
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    };

    const handleCloseModal = () => {
        setOpen(false);
    };

    const renderStars = (averageRating: number) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span key={i} className={i < Math.round(averageRating) ? "text-yellow-500" : "text-gray-300"}>★</span>
            );
        }
        return stars;
    };

    return (
        <div className="mt-4 p-4 mx-4">
            <div className="flex items-center mb-4">
                <div className="bg-red-500 w-1.5 h-8 mr-4" />
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
                        <Box display="flex" alignItems="center" className="mx-auto justify-between gap-8">
                            <Typography variant="body1" component="a" href="#" className="cursor-pointer">
                                Phổ thông
                            </Typography>
                            <Typography variant="body1" component="a" href="#" className="cursor-pointer">
                                Du lịch
                            </Typography>
                            <Typography variant="body1" component="a" href="#" className="cursor-pointer">
                                Định tuyến
                            </Typography>
                            <Typography variant="body1" component="a" href="#" className="cursor-pointer">
                                Khăn
                            </Typography>
                            <Typography variant="body1" component="a" href="#" className="cursor-pointer">
                                Túi & Dây đeo
                            </Typography>
                            <Typography variant="body1" component="a" href="#" className="cursor-pointer">
                                Nước lau
                            </Typography>
                        </Box>

                        <Button variant="contained" color="primary" className="ml-auto">
                            Xem tất cả
                        </Button>
                    </Box>

                    <Divider className="my-2" />
                    <div className="flex justify-start items-start space-x-4">
                        <Box className="w-[240px] h-[634px] mt-[-2px]">
                            <Image
                                src="https://bizweb.dktcdn.net/100/262/937/themes/813962/assets/collection_4_banner.jpg?1720673795720"
                                alt="Category Image"
                                width={240}
                                height={634}
                                layout="fixed"
                            />
                        </Box>

                        {/* Skeleton loading */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-screen-lg">
                            {loading ? (
                                [...Array(itemsPerPage)].map((_, index) => (
                                    <div key={index} className="relative flex flex-col items-center cursor-pointer overflow-hidden rounded-md shadow-lg">
                                        <Skeleton variant="rectangular" width={218} height={218} />
                                        <div className="text-center mt-2 px-4">
                                            <Skeleton variant="text" width="70%" />
                                            <Skeleton variant="text" width="50%" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                products.slice(currentIndex, currentIndex + itemsPerPage).map((product) => (
                                    <div
                                        key={product.id}
                                        className="relative flex flex-col items-center cursor-pointer overflow-hidden rounded-md shadow-lg hover:shadow-xl"
                                    >
                                        <Image
                                            src={product.imagePath}
                                            alt={product.title}
                                            width={218}
                                            height={218}
                                            className="rounded-md"
                                        />
                                        <div className="product-hover absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
                                            <IconButton
                                                className="absolute right-0"
                                                color="secondary"
                                                onClick={() => handleOpenModal(product)}
                                                sx={{
                                                    backgroundColor: 'white',
                                                    borderRadius: '50%',
                                                    padding: '8px',
                                                    '& svg': {
                                                        color: 'black',
                                                    },
                                                    top: '-50px',
                                                    '&:hover': {
                                                        backgroundColor: '#ff3048',
                                                        '& svg': {
                                                            color: 'white',
                                                        },
                                                    },
                                                }}
                                            >
                                                <SearchIcon fontSize="large" />
                                            </IconButton>
                                            <Button
                                                sx={{
                                                    backgroundColor: '#f44336',
                                                    color: 'white',
                                                    padding: '8px 16px',
                                                    width: '100%',
                                                    '&:hover': {
                                                        backgroundColor: '#a22622',
                                                    },
                                                }}
                                                onClick={() => router.push(`/product-detail/${product.id}`)}
                                            >
                                                Xem chi tiết
                                            </Button>
                                        </div>
                                        <div className="text-center mt-2 px-4">
                                            <Typography
                                                variant="subtitle1"
                                                style={{
                                                    color: 'black',
                                                    transition: 'color 0.3s',
                                                    maxWidth: '192px',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                                className="hover:text-red-500"
                                            >
                                                {product.title}
                                            </Typography>
                                            <div className="mt-1">{renderStars(product.averageRating)}</div>
                                            <Typography variant="body2" className="text-gray-500 mt-1">
                                                {product.price.toLocaleString()}₫
                                            </Typography>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Modal for Product Details */}
                    <Dialog open={open} onClose={handleCloseModal} maxWidth="md">
                        <DialogContent>
                            <div className="flex items-center space-x-8">
                                <div className="flex-1">
                                    <Image
                                        src={selectedProduct?.imagePath || ""}
                                        alt={selectedProduct?.title || ""}
                                        width={390}
                                        height={390}
                                        className="rounded-md"
                                    />
                                </div>
                                <div className="flex-2 space-y-4">
                                    <Typography
                                        variant="h6"
                                        className="font-bold text-ellipsis text-black"
                                        style={{
                                            whiteSpace: "normal",  // Cho phép xuống dòng
                                            wordWrap: "break-word",  // Tự động bẻ từ nếu dài
                                            overflow: "visible",  // Không ẩn văn bản
                                            display: "block",  // Đảm bảo tiêu đề hiển thị trên một dòng
                                        }}
                                    >
                                        {selectedProduct?.title}
                                    </Typography>

                                    <Typography variant="subtitle1" className="text-gray-600">
                                        Thương hiệu: <span className="text-red-500">beYoga</span>
                                    </Typography>
                                    <Typography variant="h5" className="text-red-500">
                                        {selectedProduct?.price?.toLocaleString()}₫
                                    </Typography>
                                    <Typography variant="body2" className="text-black max-w-xl overflow-hidden">
                                        {selectedProduct?.productDetail?.description || "Thông tin sản phẩm đang cập nhật."}
                                    </Typography>
                                    <span
                                        className={"text-red-600 hover:cursor-pointer"}
                                        onClick={() => router.push(`/product-detail/${selectedProduct.id}`)}>
                                        Xem chi tiết
                                    </span>
                                    <div className="flex items-center space-x-4">
                                        <CustomNumberInput
                                            aria-label="Quantity"
                                            placeholder="Nhập số lượng…"
                                            value={quantity} // Liên kết giá trị state với ô nhập
                                            onChange={(event, val) => setQuantity(val)} // Cập nhật giá trị state khi thay đổi
                                        />
                                        <Button
                                            sx={{
                                                backgroundColor: '#f44336',
                                                color: 'white',
                                                padding: '8px 16px',
                                                '&:hover': {
                                                    backgroundColor: '#a22622',
                                                },
                                            }}
                                            onClick={handleAddToCart}
                                        >
                                            Thêm vào giỏ
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </Box>
            </div>
        </div>
    );
};

export default ProductByCategoryCard;
