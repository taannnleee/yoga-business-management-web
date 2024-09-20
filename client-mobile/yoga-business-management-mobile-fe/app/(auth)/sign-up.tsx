import { SafeAreaView } from "react-native-safe-area-context";
import { Text, ScrollView, View, Image, Alert } from "react-native";
import React, { useState } from "react";
import { icons, images } from "@/constants";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import Oauth from "@/components/Oauth";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { BASE_URL } from "@/api/config";
import { signUp } from "@/api/sign-up";

const SignUp = gestureHandlerRootHOC(() => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "ROLE_RESTAURANT_OWNER",
  });

  const onSignUpPress = async () => {
    const response = await signUp(form); // Use the API function

    if (response.success) {
      Alert.alert("Đăng ký thành công!", "Tài khoản của bạn đã được tạo.");
    } else {
      Alert.alert(
        "Đăng ký thất bại",
        response.error || "Email đã có người đăng ký",
      );
    }
  };

  return (
    <ScrollView className={"flex-1 bg-white"}>
      <View className={"flex-1 bg-white"}>
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
            Tạo tài khoản của bạn
          </Text>
        </View>
        <View className={"p-5"}>
          <InputField
            label={"Tên"}
            placeholder={"Nhập tên của bạn"}
            icon={icons.person}
            value={form.fullName}
            onChangeText={(value) => setForm({ ...form, fullName: value })}
          />
          <InputField
            label={"Email"}
            placeholder={"Nhập email của bạn"}
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label={"Mật khẩu"}
            placeholder={"Nhập mật khẩu của bạn"}
            icon={icons.lock}
            secureTextEntry={true}
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
          <CustomButton
            onPress={onSignUpPress}
            title={"Đăng ký"}
            className={"my-6"}
          />

          <Oauth />

          <Link
            href={"/sign-in"}
            className={"text-lg text-center text-general-200 mt-10"}
          >
            <Text>
              Bạn đã có tài khoản?{" "}
              <Text className={"text-primary-500"}>Đăng nhập</Text>
            </Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
});
export default SignUp;
