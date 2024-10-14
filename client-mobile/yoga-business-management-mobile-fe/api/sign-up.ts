// sign-up.ts
import { BASE_URL } from "@/api/config";
// Sign-up API function
export const signUp = async (form: {
  username: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}) => {
  try {
    console.log("form: ", form);
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    const responseData = await response.json();
    // Check if the response is ok (status code in the range 200-299)
    if (responseData.status === 200) {
      return { success: true, data: responseData.message };
    } else {
      return {
        success: false,
        error: responseData.message || "Sign-up failed",
      };
    }
  } catch (error) {
    // @ts-ignore
    return { success: false, error: error.message || "Network error occurred" };
  }
};
