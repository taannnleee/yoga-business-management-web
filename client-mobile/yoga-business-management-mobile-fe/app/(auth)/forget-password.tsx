import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { icons, images } from "@/constants";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { regenerateOtp } from "@/api/regenerate-otp";

const ForgetPassword = gestureHandlerRootHOC(() => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // Add loading state

  const onForgetPasswordPress = async () => {
    setLoading(true); // Show loading indicator
    const response = await regenerateOtp(form.email);
    setLoading(false); // Hide loading indicator

    if (response.success) {
      Alert.alert("Mã OTP đã được gửi đến email của bạn.");
      router.push({
        pathname: "/verify-otp",
        params: { email: form.email, password: form.password },
      });
    } else {
      Alert.alert("Thất bại", response.error || "Không thể gửi mã OTP");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View>
          <Image
            source={images.signUpFood}
            className={"z-0 w-full h-[250px] "}
          />
          <Text
            className={
              "text-2xl text-black font-JakartaSemiBold" +
              "absolute bottom-5 left-5 top-5"
            }
          >
            Đổi mật khẩu
          </Text>
        </View>
        <View className="p-5">
          <InputField
            label="Email"
            placeholder="Nhập email của bạn"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Mật khẩu"
            placeholder="Nhập mật khẩu mới của bạn"
            icon={icons.lock}
            secureTextEntry={true}
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          {/* Show ActivityIndicator when loading */}
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" className="my-6" />
          ) : (
            <CustomButton
              onPress={onForgetPasswordPress}
              title="Xác nhận"
              className="my-6"
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
});

export default ForgetPassword;
