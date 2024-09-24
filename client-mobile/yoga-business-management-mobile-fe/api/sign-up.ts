// sign-up.ts
import { BASE_URL } from "@/api/config";
// Sign-up API function
export const signUp = async (form: {
  fullName: string;
  email: string;
  password: string;
  role: string;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    // Check if the response is ok (status code in the range 200-299)
    if (response.ok) {
      const result = await response.json();
      return { success: true, data: result };
    } else {
      const error = await response.json();
      return { success: false, error: error.message || "Sign-up failed" };
    }
  } catch (error) {
    // @ts-ignore
    return { success: false, error: error.message || "Network error occurred" };
  }
};
