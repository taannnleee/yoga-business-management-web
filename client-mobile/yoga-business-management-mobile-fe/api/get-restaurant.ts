// Define the base URL of your API
import { BASE_URL } from "@/api/config";
import { RestaurantProps } from "@/types/type";

// Define the Restaurant type to match the API response structure

// Fetch restaurants by keyword from the API
export const getRestaurants = async (
  keyword: string,
  token: string | null,
): Promise<RestaurantProps[] | string> => {
  try {
    // Construct the API URL
    const url = new URL(`${BASE_URL}/api/restaurants/search`);
    url.searchParams.append("keyword", keyword);

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
    return await response.json();
  } catch (error) {
    // Handle errors and return a descriptive error message
    return `Failed to fetch restaurants: ${(error as Error).message}`;
  }
};
