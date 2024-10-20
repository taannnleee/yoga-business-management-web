"use client";
import React, { useEffect, useState } from "react";
import ProductDetailTemplate from "@/components/template/ProductDetail";
import { useParams } from "next/navigation";
import axios from "axios";

const ProductDetail: React.FC = () => {
  const params = useParams();
  const id = params.id;

  const [product, setProduct] = useState<any>(null); // Replace 'any' with a more specific type if possible
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductData = async () => {
      if (id) {
        try {
          const accessToken = localStorage.getItem("accessToken"); // Get token from localStorage
          const response = await axios.get(`http://localhost:8080/api/product-detail/getProduct/${id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response) {
            setProduct(response.data.data); // Updated to set product data
          } else {
            setError("Product not found");
          }
        } catch (error) {
          console.error("Error fetching product:", error);
          setError("Error fetching product");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProductData();
  }, [id]);

  if (loading) return <div>Loading...</div>; // Show loading state
  if (error) return <div>{error}</div>; // Show error message

  return (
      <div className="flex w-full justify-center">
            <ProductDetailTemplate product={product} />
      </div>
  );
};

export default ProductDetail;
