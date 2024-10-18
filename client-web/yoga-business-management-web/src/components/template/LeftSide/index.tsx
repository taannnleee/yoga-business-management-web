"use client";

import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";

interface ILeftSideProps {
  product?: any;
}

const LeftSide: React.FC<ILeftSideProps> = ({ product }) => {
  const [isMobile, setIsMobile] = useState(false);
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true, // This makes the slider adapt to the image height
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 700);
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  console.log("product", product);

  return (
    <div className="">
      <Slider ref={sliderRef} {...settings} className="rounded-lg mx-auto">
        {[product?.product?.thumbnail, ...product?.product?.images]?.map(
          (item: any, index: number) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
              className="rounded-lg cursor-pointer hover:opacity-80 w-full justify-center flex"
            >
              <img
                src={item}
                width={480}
                height={480}
                className="w-[480px] h-[480px] rounded-xl"
                alt={`Product image ${index + 1}`}
              />
            </div>
          )
        )}
      </Slider>
      <div className="grid grid-cols-4 gap-x-5 mt-8">
        {[product?.product?.thumbnail, ...product?.product?.images]?.length >
          1 &&
          [product?.product?.thumbnail, ...product?.product?.images]?.map(
            (item: any, index: number) => (
              <div
                key={index}
                className="p-2 border border-gray-200 rounded-xl cursor-pointer hover:opacity-50"
                onClick={() => (sliderRef.current as any)?.slickGoTo(index)}
              >
                <img
                  src={item}
                  alt={`Thumbnail ${index + 1}`}
                  style={{
                    width: "80px",
                    height: "60px",
                    objectFit: "contain",
                  }}
                />
              </div>
            )
          )}
      </div>
    </div>
  );
};

export default LeftSide;
