// sign-up.ts
import { BASE_URL } from "@/api/config";
// Sign-up API function
export const proFile = async (profileData: {
  fullname: string;
  username: string;
  email: string;
  phone: string;
  city: string;
  street: string;
  state: string;

}) => {
  try {
    const accesstoken = "hiih"
    const response = await fetch(`${BASE_URL}/user/getProfile/1`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${accesstoken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (response.ok) {
      const result = await response.json();
      return { success: true, data: result };
    } else {
      const error = await response.json();
      return { success: false, error: error.message || "Get profile fail" };
    }
  } catch (error) {
    // @ts-ignore
    return { success: false, error: error.message || "Network error occurred" };
  }
};
