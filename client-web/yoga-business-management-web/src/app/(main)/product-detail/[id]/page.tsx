"use client";
import React, { useEffect, useState } from "react";
import ProductDetailTemplate from "@/components/template/ProductDetail";
import { useParams } from "next/navigation";
import axiosInstance from "@/utils/axiosClient";
import { API_URL } from "@/config/url";

const ProductDetail: React.FC = () => {
  const params = useParams();
  const id = params.id;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductData = async () => {
      if (id) {
        try {
          const response = await axiosInstance.get(
            `${API_URL}/api/product-detail/getProduct/${id}`
          );
          if (response) {
            setProduct(response.data.data);
          } else {
            setError("Product not found");
          }
        } catch (error) {
          setError("Error fetching product");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProductData();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-[300px] text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-10 px-2">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <ProductDetailTemplate product={product} />
      </div>
    </div>
  );
};

export default ProductDetail;
