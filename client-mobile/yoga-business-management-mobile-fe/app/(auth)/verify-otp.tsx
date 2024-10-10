import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { useLocalSearchParams, useRouter } from "expo-router";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { verifyOtp } from "@/api/verify-otp";
import { icons, images } from "@/constants";
import { ReactNativeModal } from "react-native-modal";
import { changePassword } from "@/api/change-pasword";

const VerifyOtp = gestureHandlerRootHOC(() => {
  const params = useLocalSearchParams();
  const { email, password } = params;

  const [form, setForm] = useState({
    otp: "",
  });

  const [loading, setLoading] = useState(false); // Loading state
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state

  const router = useRouter();

  const onConfirmPress = async () => {
    setLoading(true); // Start loading
    try {
      // Verify the OTP
      const verifyResponse = await verifyOtp(email, form.otp);
      if (verifyResponse.success && password != null) {
        // OTP verification successful, proceed to change password
        const changePasswordResponse = await changePassword(email, password);

        if (changePasswordResponse.success) {
          // Password change successful, show the modal
          setModalVisible(true);
        } else {
          // Handle change password failure
          Alert.alert(
            "Xác nhận thất bại",
            changePasswordResponse.error || "Không thể xác nhận OTP",
          );
        }
      } else if (verifyResponse.success) {
        // Handle OTP verification failure
        Alert.alert("Xác nhận thành công", verifyResponse.data);
        // @ts-ignore
        router.replace("/sign-in");
      } else {
        // Handle OTP verification failure
        Alert.alert(
          "Xác nhận thất bại",
          verifyResponse.error + " hãy kiểm tra OTP",
        );
      }
    } catch (error) {
      // @ts-ignore
      Alert.alert("Xác nhận thất bại", "Đã xảy ra lỗi không mong muốn");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      style={{ backgroundColor: "white" }}
    >
      <View style={{ flex: 1 }}>
        <View>
          <Image
            source={images.signUpYoga}
            className={"z-0 w-full h-[250px] "}
          />
          <Text
            className={
              "text-2xl text-black font-JakartaSemiBold" +
              "absolute bottom-5 left-5 top-5"
            }
          >
            Xác nhận OTP
          </Text>
        </View>
        <View style={{ padding: 20 }}>
          <InputField
            label={"OTP"}
            placeholder={"Nhập OTP"}
            icon={icons.email}
            value={form.otp}
            onChangeText={(value) => setForm({ ...form, otp: value })}
          />

          {/* Display loading spinner or button based on loading state */}
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <CustomButton
              onPress={onConfirmPress}
              title={"Xác nhận"}
              className={"my-6"}
            />
          )}
        </View>
      </View>

      {/* Include the VerifyModal component */}
      <ReactNativeModal isVisible={modalVisible}>
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 20,
            minHeight: 300,
          }}
        >
          <Image
            source={images.check}
            style={{
              width: 110,
              height: 110,
              alignSelf: "center",
              marginVertical: 20,
            }}
          />
          <Text
            style={{
              fontSize: 24,
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            Verified
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "gray",
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            You have successfully verified your account.
          </Text>
          <CustomButton
            title={"OK"}
            onPress={() => {
              setModalVisible(false);
              router.push("/sign-in"); // Replace with the desired path
            }}
          />
        </View>
      </ReactNativeModal>
    </ScrollView>
  );
});

export default VerifyOtp;
