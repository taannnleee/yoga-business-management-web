import React from "react";
import * as SplashScreen from "expo-splash-screen";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Image, TouchableOpacity } from "react-native";
import { icons } from "@/constants";

SplashScreen.preventAutoHideAsync();

const ProductDetailLayout = () => {
  // Extract route parameters using useLocalSearchParams

  return (
    <Stack>
      <Stack.Screen
        name={"[id]"}
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Image className={"w-8 h-8 mr-10"} source={icons.backArrow} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
};

export default ProductDetailLayout;
