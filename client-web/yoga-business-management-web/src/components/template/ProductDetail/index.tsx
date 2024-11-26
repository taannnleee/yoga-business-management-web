import React, { useState, useEffect } from "react";
import {LeftSideProductDetail} from "../LeftSide/LeftSideProductDetail";
import {RightSideProductDetail} from "../RightSide/RightSideProductDetail";
import CustomerBenefits from "@/components/organisms/CustomerBenefits";
import RichTextDisplay from "@/components/organisms/RichTextDisplay";
import { FaArrowAltCircleUp, FaChevronDown, FaChevronUp } from "react-icons/fa";
import CustomerComment from "@/components/organisms/CustomerComment";
import SimilarProduct from "@/components/organisms/SimilarProduct";

interface IProductDetailTemplateProps {
    product: any;
}

const ProductDetailTemplate: React.FC<IProductDetailTemplateProps> = ({ product }) => {
    const [currentVariant, setCurrentVariant] = useState<any>({});
    const [selectedImage, setSelectedImage] = useState(product?.imagePath || "");
    const [quantity, setQuantity] = useState(1);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [isDescriptionVisible, setIsDescriptionVisible] = useState(true);  // Điều khiển trạng thái của mô tả sản phẩm
    const [isCommentVisible, setIsCommentVisible] = useState(true);  // Điều khiển trạng thái của mô tả sản phẩm

    const handleVariantSelect = (variantType: string, value: string, image: string) => {
        const updatedVariant = {
            ...currentVariant,
            [variantType]: { value, image },
        };
        setCurrentVariant(updatedVariant);
        if (variantType === 'color') {
            setSelectedImage(image);
        }
    };

    // Hàm để cuộn lên đầu trang
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // Cuộn mượt mà
        });
    };

    // Kiểm tra khi cuộn trang và hiển thị nút
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > window.innerHeight * 0.3) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Hàm để chuyển trạng thái ẩn/hiện phần mô tả sản phẩm
    const toggleDescription = () => {
        setIsDescriptionVisible(!isDescriptionVisible);
    };
    const toggleComment = () => {
        setIsCommentVisible(!isCommentVisible);
    };

    return (
        <div className="w-full max-w-screen-xl mx-auto py-10">
            <div className="flex gap-8">
                <div className="flex-[0.4]">
                    <LeftSideProductDetail
                        product={product}
                        currentVariant={currentVariant}
                        setCurrentVariant={setCurrentVariant}
                        selectedImage={selectedImage}
                        setSelectedImage={setSelectedImage}
                    />
                </div>
                <div className="flex-[0.4]">
                    <RightSideProductDetail
                        product={product}
                        quantity={quantity}
                        setQuantity={setQuantity}
                        currentVariant={currentVariant}
                        handleVariantSelect={handleVariantSelect}
                    />
                </div>
                <div className="flex-[0.2]">
                    <CustomerBenefits />
                </div>
            </div>

            {/* Mô tả sản phẩm với tiêu đề và nút thu gọn */}
            <div className="border-t-2 border-gray-300 pt-4 pb-2 flex justify-between items-center mt-12">
                <h3 className="font-bold text-lg">MÔ TẢ SẢN PHẨM</h3>
                <button
                    className="flex items-center text-gray-500 hover:text-gray-700"
                    onClick={toggleDescription}
                >
                    {isDescriptionVisible ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
                </button>
            </div>
            {isDescriptionVisible && (
                <div className="my-4">
                    <RichTextDisplay className="my-4" content={product?.description || ""} />
                </div>
            )}

            {/* Mô tả sản phẩm với tiêu đề và nút thu gọn */}
            <div className="border-t-2 border-gray-300 pt-4 pb-2 flex justify-between items-center mt-12">
                <h3 className="font-bold text-lg">ĐÁNH GIÁ SẢN PHẨM</h3>
                <button
                    className="flex items-center text-gray-500 hover:text-gray-700"
                    onClick={toggleComment}
                >
                    {isCommentVisible ? <FaChevronUp size={20}/> : <FaChevronDown size={20}/>}
                </button>
            </div>
            {isCommentVisible && (
                <div className="my-4">
                    <CustomerComment className="mb-4" productDetail={product}/>
                </div>
            )}

            <div className="border-t-2 border-gray-300 pt-4 pb-2 flex justify-between items-center mt-12">
                <h3 className="font-bold text-xl mx-auto text-red-500">Có thể bạn thích</h3>
            </div>
            <SimilarProduct/>

        </div>
    );
};

export default ProductDetailTemplate;
