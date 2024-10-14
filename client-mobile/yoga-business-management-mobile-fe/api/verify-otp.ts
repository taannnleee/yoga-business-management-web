import { BASE_URL } from "@/api/config";

export const verifyOtp = async (email: string | string[], otp: string) => {
  try {
    // Construct the URL with query parameters
    const url = new URL(`${BASE_URL}/api/auth/verifyOTP_register`);
    url.searchParams.append("OTP", otp);
    url.searchParams.append("email", email as string); // Ensure email is string

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Parse the response JSON
    const responseData = await response.json();

    // Check if the status is 200
    if (responseData.status === 200) {
      return {
        success: true,
        data: responseData.message, // Assuming message contains the desired information
      };
    } else {
      // Handle non-200 responses
      return {
        success: false,
        error: responseData.message || "Verify failed",
      };
    }
  } catch (error) {
    // Handle network or other errors
    console.error("Network Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
};
