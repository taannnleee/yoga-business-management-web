import { BASE_URL } from "@/api/config";

export const getProFile = async (token: string) => {
  try {
    const response = await fetch(`${BASE_URL}/api/user/getProfile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "x-token": token,
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const result = await response.json();
      return { success: true, data: result };
    } else {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to fetch profile",
      };
    }
  } catch (error) {
    return { success: false, error: "Network error occurred" };
  }
};

export const updateProfile = async (
  token: string,
  profileData: {
    fullname: string;
    username: string;
    email: string;
    phone: string;
    city: string;
    street: string;
    state: string;
  },
) => {
  try {
    const response = await fetch(`${BASE_URL}/api/user/updateProfile`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "x-token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });
    if (response.ok) {
      const result = await response.json();
      return { success: true, data: result };
    } else {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to fetch profile",
      };
    }
  } catch (error) {
    return { success: false, error: "Network error occurred" };
  }
};
