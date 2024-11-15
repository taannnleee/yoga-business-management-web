import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaRegHeart, FaHeart } from "react-icons/fa";

interface LeftSideProps {
  product: any;
  currentVariant: any;
  setCurrentVariant: (variant: any) => void;
  selectedImage: string;
  setSelectedImage: (image: string) => void;
}

const LeftSide: React.FC<LeftSideProps> = ({ product, currentVariant, setCurrentVariant, selectedImage, setSelectedImage }) => {
  const [selectedImageLeft, setSelectedImageLeft] = useState(selectedImage || "");
  const [selectedImageRight, setSelectedImageRight] = useState("");
  const [isFavorited, setIsFavorited] = useState(false);
  const token = 'your-auth-token'; // Replace with actual token or a mechanism to get it dynamically

  const handleVariantSelect = (variantType: string, value: string, image: string) => {
    const updatedVariant = {
      ...currentVariant,
      [variantType]: { value, image },
    };
    setCurrentVariant(updatedVariant);

    if (variantType === 'color') {
      setSelectedImageLeft(image);
      setSelectedImage(image);
    }
  };

  const fetchWishlistStatus = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/wishlist/get-wishlist-exists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product?.id }),
      });

      if (response.ok) {
        setIsFavorited(true);
      } else {
        setIsFavorited(false);
      }
    } catch (error) {
      console.error("Error fetching wishlist status:", error);
      setIsFavorited(false);
    }
  };

  useEffect(() => {
    console.log("hii")
    if (product?.variants?.color) {
      const firstColor = Object.entries(product.variants.color)[0];
      if (firstColor) {
        const [value, image] = firstColor;
        setSelectedImageLeft(image);
        setSelectedImage(image);
        setCurrentVariant((prev) => ({
          ...prev,
          color: { value, image },
        }));
      }
    }
    fetchWishlistStatus();
    // Fetch wishlist status when the product changes
    if (product?.id) {
      fetchWishlistStatus();
    }
  }, [product]);

  return (
    <div>
      <button
        className="flex top-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transform transition-transform duration-200 hover:scale-110"
        onClick={() => setIsFavorited(!isFavorited)} // You may replace this with API call to toggle wishlist status
      >
        {!isFavorited ? (
          <FaRegHeart className="text-black w-6 h-6" />
        ) : (
          <FaHeart className="text-red-500 w-6 h-6" />
        )}
      </button>

      <Image
        src={selectedImage}
        alt={product?.title || ""}
        width={390}
        height={390}
        className="rounded-md"
      />

      <div className="mt-4 flex space-x-4 overflow-x-auto">
        {product?.variants?.color &&
          Object.entries(product.variants.color).map(([color, image], index) => (
            <div key={index} className="flex flex-col items-center"
              onClick={() => handleVariantSelect('color', color, image)}>
              <Image
                src={image || '/path/to/fallback/image.jpg'}
                alt={`${color} image`}
                width={84}
                height={84}
                className={`rounded-md cursor-pointer ${image === selectedImageLeft ? "border-2 border-red-500" : ""}`}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default LeftSide;
