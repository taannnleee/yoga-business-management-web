"use client";

import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import {FaRegHeart, FaHeart, FaSearchPlus} from "react-icons/fa";

interface ILeftSideProps {
  product: {
    imagePath: string;
    // You can add additional properties if necessary
  };
}

const LeftSide: React.FC<ILeftSideProps> = ({ product }) => {
  const [isMobile, setIsMobile] = useState(false);
  const sliderRef = useRef(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 700);
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
      <div className="relative">
        <Slider ref={sliderRef} {...settings} className="rounded-lg mx-auto">
          <div className="relative flex justify-center items-center h-full w-full group">
            <img
                src={product.imagePath}
                width={480}
                height={480}
                className="w-[480px] h-[480px] rounded-xl"
                alt="Product Image"
            />
            {/* Magnifying Glass Icon */}
            <FaSearchPlus
                className="absolute text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out"/>
          </div>
        </Slider>

        {/* Heart icon button */}
        <button
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transform transition-transform duration-200 hover:scale-110">
          {!isFavorited ? <FaRegHeart className="text-black w-6 h-6"/> : <FaHeart className="text-red-500 w-6 h-6"/>}

        </button>
      </div>
  );
};

export default LeftSide;
