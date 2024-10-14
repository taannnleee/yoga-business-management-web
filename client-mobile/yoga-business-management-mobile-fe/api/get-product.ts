// Define the base URL of your API
import { BASE_URL } from "@/api/config";
import { ProductProps } from "@/types/type";

// Fetch products from the API
export const getProducts = async (
  page: number,
  size: number,
  token: string | null,
  keyword?: string,
): Promise<ProductProps[] | string> => {
  try {
    // Construct the API URL
    const url = new URL(`${BASE_URL}/api/home/getAllProduct`);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("size", size.toString());
    if (keyword) {
      url.searchParams.append("keyword", keyword); // Truyền keyword nếu có
    }
    // Send the API request
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // JWT token in the Authorization header
        "Content-Type": "application/json",
      },
    });
    // Check if the response was successful
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    // Parse the response as JSON
    const responseData = await response.json();
    // Extract the products from the response (assuming they are in 'content')
    return responseData.data.content;
  } catch (error) {
    // Handle errors and return a descriptive error message
    return `Failed to fetch products: ${(error as Error).message}`;
  }
};
