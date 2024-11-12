"use client";

import React from "react";

interface IRightSideProps {
    product: {
        title: string;
        price: number;

        description: string;
        brand: string;
        color: string;
        averageRating: number;
    };
}

const RightSide: React.FC<IRightSideProps> = ({ product }) => {
    return (
        <div className="flex flex-col gap-y-8">
            <h1 className="text-gray-600 font-bold text-3xl">{product.title}</h1>

            <div className="flex flex-col">
                <div className="flex items-center">
                    <h3 className="text-gray-400 text-lg">Giá bán: </h3>
                    <h3 className="text-gray-500 text-lg ml-2 cursor-pointer">{product.price}</h3>
                </div>
                <div className="flex items-center">
                    <h3 className="text-gray-400 text-lg">Màu sắc: </h3>
                    <h3 className="text-gray-500 ml-2 text-lg cursor-pointer">{product.color}</h3>
                </div>
                {/* <div className="flex items-center">
                    <h3 className="text-gray-400 text-lg">Kích thước: </h3>
                    <h3 className="text-gray-500 ml-2 text-lg cursor-pointer">{product.size}</h3>
                </div> */}
                <div className="flex items-center">
                    <h3 className="text-gray-400 text-lg">Thương hiệu: </h3>
                    <h3 className="text-gray-500 ml-2 text-lg cursor-pointer">{product.brand}</h3>
                </div>
            </div>

            <div className="flex items-center">
                <button className="items-center rounded-lg px-4 py-2 text-center w-fit flex hover:opacity-50 bg-yellow-800 text-white font-semibold text-lg">
                    Thêm vào giỏ hàng
                </button>
            </div>

            <div className="flex flex-col gap-y-2">
                <h1 className="text-gray-600 font-bold text-lg">Mô tả về sản phẩm</h1>
                <p className="text-gray-400 text-sm">{product.description}</p>
            </div>
        </div>
    );
};

export default RightSide;
