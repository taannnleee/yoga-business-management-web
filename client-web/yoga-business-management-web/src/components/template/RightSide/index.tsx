"use client";

import React from "react";

interface IRightSideProps {
  product: any;
}

const RightSide: React.FC<IRightSideProps> = (props) => {
  const { product } = props;

  return (
    <div className="flex flex-col gap-y-8">
      <h1 className="text-gray-600 font-bold text-3xl">
        {product?.product?.name}
      </h1>

      <div className="flex flex-col">
        <div className="flex items-center">
          <h3 className="text-gray-400 text-lg">Giá bán: </h3>
          <h3 className="text-gray-500 text-lg ml-2 cursor-pointer">
            {product?.price.displayPrice}
          </h3>
        </div>
        {product?.product?.properties &&
          Object.entries(product?.product?.properties).map(
            ([key, value]: [string, any]) => (
              <div key={key} className="flex items-center">
                <h3 className="text-gray-400 text-lg">
                  {key[0]?.toUpperCase()}
                  {key?.substring(1)} :
                </h3>
                <h3 className="text-gray-500 ml-2 text-lg cursor-pointer">
                  {value}
                </h3>
              </div>
            )
          )}
      </div>

      <div className="flex items-center">
        <button
          className={`items-center rounded-lg px-4 py-2 text-center w-fit flex hover:opacity-50 bg-yellow-800 text-white font-semibold text-lg ${
            false ? "opacity-20" : ""
          }`}
        >
          Thêm vào giỏ hàng
        </button>
      </div>

      <div className="flex flex-col gap-y-2">
        <h1 className="text-gray-600 font-bold text-lg">Mô tả về sản phẩm</h1>
        <p className="text-gray-400 text-sm">
          {product?.product?.fullDescription}
        </p>
      </div>
    </div>
  );
};

export default RightSide;
