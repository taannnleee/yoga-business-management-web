// delete-jwt.ts
import * as SecureStore from "expo-secure-store";

export const deleteJwt = async (): Promise<void> => {
    try {
        await SecureStore.deleteItemAsync("jwt");
        console.log("JWT token deleted successfully.");
    } catch (e) {
        console.error("Failed to delete JWT token", e);
    }
};

