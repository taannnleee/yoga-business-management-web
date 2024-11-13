// src/api/product-detail.ts
import { Product } from "@/types/product";
import { BASE_URL } from "@/api/config"; // Adjust path if necessary

// Define the function to fetch product data by ID
export const fetchProductData = async (
  id: string,
  token: string | null,
): Promise<Product | null> => {
  try {
    const response = await fetch(`${BASE_URL}/api/product/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();

    if (result.status === 200) {
      const productData: Product = result.data;
      console.log("Product data:", productData);
      return productData;
    } else {
      console.error("Error: Unexpected response status", result.status);
      return null;
    }
  } catch (error) {
    console.error("Error fetching product data:", error);
    return null;
  }
};
