import { Image, Text, View } from "react-native";
import CustomButton from "@/components/CustomButton";
import React from "react";
import { icons } from "@/constants";

function handleGoogleSignIn() {}

const Oauth = () => {
  const handleGoogleSignIn = async () => {};
  return (
    <View>
      <View
        className={"flex flex-row justify-center items-center" + "mt-4 gap-x-3"}
      >
        <View className={"flex-1 h-[1px] bg-general-100"} />
        <View className={"text-lg"}>
          <Text>Hoặc</Text>
        </View>
        <View className={"flex-1 h-[1px] bg-general-100"} />
      </View>
      <CustomButton
        bgVariant={"outline"}
        textVariant={"primary"}
        onPress={handleGoogleSignIn}
        iconLeft={() => (
          <Image
            resizeMode={"contain"}
            source={icons.google}
            className={"w-5 h-5 mx-2"}
          />
        )}
        className={"mt-5 w-full shadow-none"}
        title={"Đăng nhập với google"}
      />
    </View>
  );
};
export default Oauth;
