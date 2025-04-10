// RightSide.tsx
import React, { useState } from "react";
import { Typography, Button, CircularProgress } from '@mui/material';
import { CustomNumberInput } from "@/components/atom/CustomNumberInput";
import Image from "next/image";
import { incrementTotalItems } from "@/redux/cart/cartSlice";
import { useToast } from "@/hooks/useToast";
import { useDispatch } from "react-redux";
import { API_URL } from "@/config/url";
import axiosInstance from "@/utils/axiosClient";
interface RightSideProps {
    product: any;
    quantity: number;
    setQuantity: (quantity: React.SetStateAction<any>) => void;
    currentVariant: any;
    selectedImage: string;
    handleVariantSelect: (variantType: string, value: string, image: string) => void;
}

export const RightSideProductDetail: React.FC<RightSideProps> = ({
    product, quantity, setQuantity, currentVariant, selectedImage, handleVariantSelect
}) => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const toast = useToast();
    const handleAddToCart = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post(
                `${API_URL}/api/cart/add-to-cart`,
                {
                    productId: product.id.toString(),
                    quantity,
                    currentVariant,
                }

            );

            toast.sendToast("Thành công", "Đã thêm sản phẩm vào giỏ hàng");
            dispatch(incrementTotalItems());
        } catch (err: any) {
            console.error("Error adding product to cart:", err.message);
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <div className="space-y-4">
            <Typography variant="h6" className="font-bold text-ellipsis text-black">
                {product?.title}
            </Typography>
            {/* Ratings and Reviews */}
            <div className="flex items-center gap-2">
                <Typography variant="subtitle1" className="text-gray-600 flex justify-between items-center space-x-4">
                    {/* Rating */}
                    <div className="flex items-center space-x-2">
                        <span className="font-bold text-black">
                            {product?.averageRating?.toFixed(1)}
                        </span>
                        <span className="text-yellow-500">
                            {Array.from({ length: 5 }, (_, index) => {
                                if (product?.averageRating > index + 0.5) {
                                    return "⭐"; // Full star
                                } else if (product?.averageRating > index) {
                                    return "✩"; // Half star
                                } else {
                                    return "☆"; // Empty star
                                }
                            })}
                        </span>
                        <span className="text-gray-500">|</span> {/* Separator | */}

                    </div>

                    {/* Separator and Views/Sales */}
                    <div className="flex items-center space-x-2">
                        <span className="text-black font-semibold">100 Đánh giá/Bình luận</span>
                        <span className="text-gray-500">|</span> {/* Separator | */}
                        <span className="text-black font-semibold">{product?.sold} Đã mua</span>
                    </div>
                </Typography>


            </div>
            <Typography variant="subtitle1" className="text-gray-600">
                Mã sản phẩm: <span className="text-red-500">{product?.code}</span>
            </Typography>
            <Typography variant="subtitle1" className="text-gray-600">
                Thương hiệu: <span className="text-red-500">{product?.brand}</span>
            </Typography>
            <Typography variant="h3" color={"red"}>
                {product?.price?.toLocaleString()}₫
            </Typography>
            {/*<Typography variant="body2" className="text-black max-w-xl overflow-hidden">*/}
            {/*    {product?.description || "Thông tin sản phẩm đang cập nhật."}*/}
            {/*</Typography>*/}
            <div>
                {product?.variants &&
                    Object.entries(product.variants).map(([variantType, variantValues]) => {
                        console.log("Variant Type :", variantType);
                        console.log("Variant Values :", variantValues);

                        return (
                            <div key={variantType} className={"my-4"}>
                                <Typography variant="subtitle1" className="text-black font-bold">
                                    {variantType.charAt(0).toUpperCase() + variantType.slice(1)}
                                </Typography>
                                <div className="flex items-center space-x-4">
                                    {Object.entries(variantValues as { [key: string]: string }).map(([value, image], index) => (
                                        <div
                                            key={index}
                                            className={"flex items-center justify-evenly mr-4"}
                                            onClick={() => {

                                                handleVariantSelect(variantType, value, image);
                                            }}
                                        >
                                            <Typography className="cursor-pointer">
                                                <div className={"flex items-center justify-start space-x-2"}>
                                                    {variantType === 'color' ? (
                                                        <>
                                                            <Image
                                                                src={image || '/path/to/fallback/image.jpg'}
                                                                alt={`${value} color`}
                                                                width={40}
                                                                height={40}
                                                                className={`rounded-md cursor-pointer ${image === currentVariant.color?.image ? 'border-2 border-red-500' : ''}`}
                                                            />
                                                            <Typography variant="caption" className="text-center mt-1 mr-8">
                                                                {value}
                                                            </Typography>
                                                        </>
                                                    ) : (
                                                        <div
                                                            className={`flex items-center justify-center w-11 h-11 border border-gray-300 rounded-md cursor-pointer ${value === currentVariant[variantType]?.value ? 'border-2 border-red-800' : ''}`}
                                                        >
                                                            <Typography className="text-center">{value}</Typography>
                                                        </div>
                                                    )}
                                                </div>
                                            </Typography>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
            </div>

            <div className="flex items-center space-x-4 mt-4">
                <span>
                    Số lượng:
                </span>
                <CustomNumberInput
                    aria-label="Quantity"
                    placeholder="Nhập số lượng…"
                    value={quantity}
                    onChange={(event, val) => setQuantity(val)}
                />

            </div>
            <div className="flex items-center space-x-4 mt-4">
                <Button
                    sx={{
                        width: '230px',
                        height: '40px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        padding: '8px 16px',
                        '&:hover': {
                            backgroundColor: '#a22622',
                        },
                    }}
                    onClick={handleAddToCart}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'THÊM VÀO GIỎ'}
                </Button>
                {/*<Button*/}
                {/*    sx={{*/}
                {/*        width: '230px',*/}
                {/*        height: '40px',*/}
                {/*        backgroundColor: '#d1d1d1',*/}
                {/*        color: 'red',*/}
                {/*        padding: '8px 16px',*/}
                {/*        '&:hover': {*/}
                {/*            backgroundColor: '#78B3CE',*/}
                {/*        },*/}
                {/*    }}*/}
                {/*    onClick={handleAddToCart}*/}
                {/*>*/}
                {/*    MUA NGAY*/}
                {/*</Button>*/}

            </div>
        </div>
    );
};

