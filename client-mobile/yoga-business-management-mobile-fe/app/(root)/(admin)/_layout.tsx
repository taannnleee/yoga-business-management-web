import React, { useEffect, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Keyboard,
  Platform,
  View,
} from "react-native";
import { Tabs } from "expo-router";
import { icons } from "@/constants";

const TabIcon = ({
  source,
  focused,
}: {
  source: ImageSourcePropType;
  focused: boolean;
}) => (
  <View
    className={`flex flex-row justify-center items-center rounded-full ${
      focused ? "bg-general-300" : ""
    }`}
  >
    <View
      className={`rounded-full w-12 h-12 items-center justify-center ${focused ? "bg-general-400" : ""}`}
    >
      <Image
        source={source}
        tintColor={"white"}
        resizeMode={"contain"}
        className={"w-7 h-7"}
      />
    </View>
  </View>
);

const TabsLayout = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardDidShow" : "keyboardDidShow",
      () => setKeyboardVisible(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardDidHide" : "keyboardDidHide",
      () => setKeyboardVisible(false),
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const tabBarStyle = {
    backgroundColor: "#333333",
    borderRadius: 20,
    paddingBottom: 0,
    overflow: "hidden",
    marginHorizontal: 20,
    marginBottom: 20,
    height: keyboardVisible ? 0 : 58,
    display: "flex",
    justifyContent: "",
    alignItems: "center",
    flexDirection: "colum",
    position: "absolute",
  };

  return (
    <Tabs
      initialRouteName={"dashboard"}
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarShowLabel: false,
        // @ts-ignore
        tabBarStyle: tabBarStyle,
      }}
    >
      <Tabs.Screen
        name={"dashboard"}
        options={{
          title: "Dashboard",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={icons.home} />
          ),
        }}
      />

      <Tabs.Screen
        name={"user"}
        options={{
          title: "User",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={icons.out} />
          ),
        }}
      />

      <Tabs.Screen
        name={"product"}
        options={{
          title: "Product",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={icons.out} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
