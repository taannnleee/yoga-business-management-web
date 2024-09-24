import { BASE_URL } from "@/api/config";
// Regenerate OTP API function
export const regenerateOtp = async (email: string) => {
  try {
    // Construct the URL for OTP regeneration
    const url = `${BASE_URL}/auth/regenerate-otp?email=${encodeURIComponent(email)}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if the response is ok (status code in the range 200-299)
    if (response.ok) {
      const result = await response.text(); // Parse the response as text, not JSON
      return { success: true, message: result };
    } else {
      const error = await response.text(); // Parse error response as text too
      return { success: false, error };
    }
  } catch (error) {
    // Handle network or unexpected errors
    // @ts-ignore
    return { success: false, error: error.message || "Network error occurred" };
  }
};
