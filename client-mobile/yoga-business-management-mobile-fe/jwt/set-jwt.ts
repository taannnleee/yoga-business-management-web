import * as SecureStore from "expo-secure-store";

export const saveJwtToken = async (token: string) => {
  try {
    await SecureStore.setItemAsync("jwt", token);
  } catch (error) {
    console.error("Error saving JWT token", error);
  }
};
