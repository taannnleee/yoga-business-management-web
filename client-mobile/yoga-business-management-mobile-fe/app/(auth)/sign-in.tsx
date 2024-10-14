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
import Oauth from "@/components/Oauth";
import { Link, router } from "expo-router";
import { signIn } from "@/api/sign-in";
import { saveJwtToken } from "@/jwt/set-jwt";

const SignIn = gestureHandlerRootHOC(() => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const onSignInPress = async () => {
    setLoading(true);
    const response = await signIn(form); // Use the API function
    setLoading(false);
    if (response.success) {
      const tokens = response.data.data;
      // Save JWT token to SecureStore
      await saveJwtToken(tokens.accesstoken, tokens.refreshtoken);
      Alert.alert("Đăng nhập thành công!");
      // @ts-ignore
      router.replace("/(root)/(tabs)/home");
    } else {
      Alert.alert("Đăng nhập thất bại", "Sai tên đăng nhập hoặc mật khẩu");
    }
  };

  return (
    <ScrollView className={"flex-1 bg-white"}>
      <View className={"flex-1 bg-white"}>
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
            Đăng nhập tài khoản của bạn
          </Text>
        </View>
        <View className={"p-5"}>
          <InputField
            label={"Email"}
            placeholder={"Nhập email của bạn"}
            icon={icons.email}
            value={form.username}
            onChangeText={(value) => setForm({ ...form, username: value })}
          />
          <InputField
            label={"Mật khẩu"}
            placeholder={"Nhập mật khẩu của bạn"}
            icon={icons.lock}
            secureTextEntry={true}
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
          {loading ? (
            <ActivityIndicator size={"large"} color={"#0000ff"} />
          ) : (
            <CustomButton
              onPress={onSignInPress}
              title={"Đăng nhập"}
              className={"my-6"}
            />
          )}

          <Oauth />

          <Link
            href={"/sign-up"}
            className={"text-lg text-center text-general-200 mt-10"}
          >
            <Text>
              Bạn chưa có tài khoản?{" "}
              <Text className={"text-primary-500"}>Đăng ký</Text>
            </Text>
          </Link>
          <Link
            href={"/forget-password"}
            className={"text-lg text-center text-general-200 mt-10"}
          >
            <Text>
              Bạn quên mật khẩu{" "}
              <Text className={"text-primary-500"}>Quên mật khẩu</Text>
            </Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
});
export default SignIn;
