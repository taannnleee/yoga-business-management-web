// get-jwt.ts
import * as SecureStore from "expo-secure-store";

export const getJwt = async (): Promise<string | null> => {
  try {
    const userToken = await SecureStore.getItemAsync("accessToken");

    return userToken || null; // Returns the token if it exists, otherwise returns null
  } catch (e) {
    console.error("Failed to retrieve token", e);
    return null; // In case of error, return null or handle it as you wish
  }
};
