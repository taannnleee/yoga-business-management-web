import React from "react";
import LeftSide from "../LeftSide";
import RightSide from "../RightSide";

interface IProductDetailTemplateProps {
    product: {
        id: number;
        title: string;
        description: string;
        price: number;
        imagePath: string;
        productDetail: {
            color: string;
            size: string;
            code: string;
            brand: string;
            fullDescription: string;
            ratings: any[]; // Define a more specific type if possible
        };
        subCategory: {
            name: string;
        };
        averageRating: number;
    };
}

const ProductDetailTemplate: React.FC<IProductDetailTemplateProps> = ({ product }) => {
    console.log("product", product);

    return (
        <div className="py-10 bg-white desktop:min-w-[1200px] laptop:min-w-[960px] mx-auto min-h-[800px]">
            <div className="flex gap-y-8 gap-x-[80px] justify-center flex-col laptop:flex-row">
                <div className="desktop:w-[480px] w-[480px]">
                    <LeftSide product={product} />
                </div>
                <div className="w-[480px]">
                    <RightSide product={product} />
                </div>
            </div>
        </div>
    );
};

export default ProductDetailTemplate;
