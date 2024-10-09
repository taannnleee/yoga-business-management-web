import { SafeAreaView } from "react-native-safe-area-context";
import { Image, Text, TouchableOpacity, View } from "react-native";
import React, { useRef, useState } from "react";
import { router } from "expo-router";
import Swiper from "react-native-swiper";
import { onWelcome } from "@/constants";
import CustomButton from "@/components/CustomButton";

const Welcome = () => {
  const swiperRef = useRef<Swiper>(null);
  const [index, setIndex] = useState(0);
  const isLastPage = index === onWelcome.length - 1;
  return (
    <SafeAreaView
      className={"flex h-full items-center justify-between bg-white"}
    >
      <TouchableOpacity
        onPress={() => {
          // @ts-ignore
          router.replace("/(auth)/sign-up");
        }}
        className={"w-full flex justify-end items-end p-5"}
      >
        <Text className={"text-black text-md font-JakartaBold"}>Skip</Text>
      </TouchableOpacity>
      <Swiper
        ref={swiperRef}
        loop={false}
        dot={
          <View className={"w-[32px] h-[4px] mx-1 bg-[#E2E8F0] rounded-full"} />
        }
        activeDot={
          <View className={"w-[32px] h-[4px] mx-1 bg-[#0286FF] rounded-full"} />
        }
        onIndexChanged={(index) => setIndex(index)}
      >
        {onWelcome.map((item) => (
          <View
            key={item.id}
            className={"flex items-center justify-center p-5"}
          >
            <Image
              source={item.image}
              resizeMode={"contain"}
              className={"w-full h-[300px] "}
            />
            <View
              className={
                "flex flex-row items-center justify-center w-full mt-10"
              }
            >
              <Text
                className={"text-black text-3xl font-bold mx-10 text-center"}
              >
                {item.title}
              </Text>
            </View>
            <Text
              className={
                "text-md font-JakartaSemiBold text-[#858585] mx-10 mt-3 text-center"
              }
            >
              {item.description}
            </Text>
          </View>
        ))}
      </Swiper>
      <CustomButton
        onPress={() =>
          isLastPage
            ? router.replace("/(auth)/sign-up")
            : swiperRef.current?.scrollBy(1)
        }
        title={isLastPage ? "Bắt đầu" : "Tiếp tục"}
        className={"w-11/12 h-10 my-10"}
      ></CustomButton>
    </SafeAreaView>
  );
};
export default Welcome;
