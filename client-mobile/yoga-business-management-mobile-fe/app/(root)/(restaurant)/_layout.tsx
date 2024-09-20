import React from "react";
import * as SplashScreen from "expo-splash-screen";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Image, TouchableOpacity } from "react-native";
import { icons } from "@/constants";

SplashScreen.preventAutoHideAsync();

const RestaurantLayout = () => {
  // Extract route parameters using useLocalSearchParams
  const { nameRestaurant } = useLocalSearchParams<{ nameRestaurant: string }>();

  // Use a default value if the nameRestaurant parameter is not provided
  const restaurantName = nameRestaurant || "Default Name";

  return (
    <Stack>
      <Stack.Screen
        name={"[restaurant]"}
        options={{
          headerShown: true,
          headerTitle: restaurantName, // Set header title dynamically
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

export default RestaurantLayout;
