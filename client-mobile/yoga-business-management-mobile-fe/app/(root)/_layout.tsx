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
    </Stack>
  );
};
export default AuthedLayout;
