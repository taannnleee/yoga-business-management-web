import * as SecureStore from "expo-secure-store";

export const deleteJwt = async (): Promise<void> => {
  try {
    // Lấy token từ SecureStore
    // const refreshToken = await SecureStore.getItemAsync("refreshToken");
    //
    // if (!refreshToken) {
    //   console.log("No token found");
    //   return;
    // }
    //
    // // Gọi API logout với token
    // const response = await fetch(`${BASE_URL}/api/auth/logout`, {
    //   method: "POST", // Sử dụng phương thức GET
    //   headers: {
    //     "x-token": refreshToken, // Gửi token từ frontend lên backend
    //   },
    // });
    //
    // // Kiểm tra phản hồi từ API
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    //
    // const data = await response.json();
    // console.log(data.message || "Logout successful");

    // Xóa token khỏi SecureStore sau khi gọi API thành công
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("freshToken");
  } catch (e) {
    console.error("Failed to delete JWT token", e);
  }
};
