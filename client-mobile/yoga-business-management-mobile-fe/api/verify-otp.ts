import { BASE_URL } from "@/api/config";
// Verify OTP API function using query parameters
export const verifyOtp = async (email: string | string[], otp: string) => {
  try {
    // Construct the URL with query parameters
    const url = new URL(`${BASE_URL}/auth/verify-otp`);
    url.searchParams.append("email", email as string); // ensure email is string
    url.searchParams.append("otp", otp);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Read the response body once
    const responseText = await response.text(); // Read response as text

    if (response.ok) {
      try {
        // Attempt to parse response text as JSON
        const result = JSON.parse(responseText);
        return { success: true, data: result };
      } catch (jsonError) {
        // If parsing fails, handle it as a non-JSON response
        return { success: true, data: responseText };
      }
    } else {
      // Handle non-200 responses
      return { success: false, error: responseText || "Verify failed" };
    }
  } catch (error) {
    // Handle network errors
    // @ts-ignore
    return { success: false, error: error.message || "Network error occurred" };
  }
};
