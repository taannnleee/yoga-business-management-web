import React from "react";
import axios from "axios";
import ProductDetailTemplate from "@/components/template/ProductDetail";

const ProductDetailPage = async (props: any) => {
  console.log("props", props);

  const upc = props?.params?.slug?.split("-").pop();

  let product = null;

  try {
    const response = await axios.get(
      `http://localhost:4000/products/detail?upc=${upc}&storeId=6`
    );

    if (response) {
      console.log("response", response?.data);
    }

    if (response?.data?.success) {
      product = response?.data?.data;
    } else {
      product = null;
    }
  } catch (error: any) {
    console.log("error", error);
    product = null;
  }

  return (
    <div className="flex w-full justify-center">
      <ProductDetailTemplate product={product} />
    </div>
  );
};

export default ProductDetailPage;
