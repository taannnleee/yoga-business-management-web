import React from "react";
import * as SplashScreen from "expo-splash-screen";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Image, TouchableOpacity } from "react-native";
import { icons } from "@/constants";

SplashScreen.preventAutoHideAsync();

const ProductDetailLayout = () => {
  // Extract route parameters using useLocalSearchParams
  const { nameProduct } = useLocalSearchParams<{ nameProduct: string }>();
  // Use a default value if the nameRestaurant parameter is not provided
  const productName = nameProduct || "Default Name";

  return (
    <Stack>
      <Stack.Screen
        name={"[product]"}
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
