"use client";

import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";

interface ILeftSideProps {
  product: {
    imagePath: string;
    // You can add additional properties if necessary
  };
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
    adaptiveHeight: true,
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 700);
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
      <div className="">
        <Slider ref={sliderRef} {...settings} className="rounded-lg mx-auto">
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }} className="rounded-lg cursor-pointer hover:opacity-80 w-full justify-center flex">
            <img
                src={product.imagePath}
                width={480}
                height={480}
                className="w-[480px] h-[480px] rounded-xl"
                alt="Product Image"
            />
          </div>
        </Slider>
      </div>
  );
};

export default LeftSide;
