// Define the base URL of your API
import { BASE_URL } from "@/api/config";
import { FoodProps } from "@/types/type";

// Define the function to fetch foods for a restaurant
export const getFoodsInRestaurant = async (
  restaurantId: string,
  token: string | null,
  keyword: string,
): Promise<FoodProps[] | string> => {
  try {
    // Construct the API URL with the keyword parameter
    const url = new URL(`${BASE_URL}/api/food/restaurant/${restaurantId}`);
    url.searchParams.append("keyword", keyword); // Add keyword to query parameters

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

    // Parse the response as JSON and return the data
    return await response.json();
  } catch (error) {
    // Handle errors and return a descriptive error message
    return `Failed to fetch restaurant foods: ${(error as Error).message}`;
  }
};
