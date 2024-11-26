import React from "react";
import * as SplashScreen from "expo-splash-screen";

import { Stack } from "expo-router";

SplashScreen.preventAutoHideAsync();

const AuthedLayout = () => {
  return (
    <Stack>
      <Stack.Screen name={"(tabs)"} options={{ headerShown: false }} />
      <Stack.Screen name={"(product)"} options={{ headerShown: false }} />
      <Stack.Screen name={"(admin)"} options={{ headerShown: false }} />
      <Stack.Screen name={"(checkout)"} options={{ headerShown: false }} />
      <Stack.Screen name={"(cart)"} options={{ headerShown: false }} />
      <Stack.Screen name={"(rating-detail)"} options={{ headerShown: false }} />
      <Stack.Screen name={"(notification)"} options={{ headerShown: false }} />
      <Stack.Screen name={"(wishlist)"} options={{ headerShown: false }} />
    </Stack>
  );
};
export default AuthedLayout;
