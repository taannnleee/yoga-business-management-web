import { BASE_URL } from "@/api/config";

// Change Password API function
export const changePassword = async (
  email: string | string[],
  newPassword: string | string[],
) => {
  try {
    // Construct the URL with query parameters
    const url = new URL(`${BASE_URL}/auth/profile/update/password`);
    if (typeof email === "string") {
      url.searchParams.append("email", email);
    }
    if (typeof newPassword === "string") {
      url.searchParams.append("password", newPassword);
    }

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Read the response as JSON
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
      return {
        success: false,
        error: responseText || "Failed to change password",
      };
    }
  } catch (error) {
    // Handle network errors
    // @ts-ignore
    return { success: false, error: error.message || "Network error occurred" };
  }
};
