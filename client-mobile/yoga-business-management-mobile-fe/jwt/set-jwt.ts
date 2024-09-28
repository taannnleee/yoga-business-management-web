import * as SecureStore from "expo-secure-store";

export const saveJwtToken = async (
  accessToken: string,
  refreshToken: string,
) => {
  try {
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
  } catch (error) {
    console.error("Error saving JWT token", error);
  }
};
