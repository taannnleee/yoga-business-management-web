import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { FlatList, Text, View, Image, ActivityIndicator } from "react-native";
import RestaurantCard from "@/components/RestaurantCard";
import TextInputSearch from "@/components/TextInputSearch";
import { icons, images } from "@/constants";
import { getRestaurants } from "@/api/get-restaurant";
import { getJwt } from "@/jwt/get-jwt";
import { SearchBar } from "react-native-elements";
import { useLocalSearchParams } from "expo-router";
import FoodCard from "@/components/FoodCard";
import { getFoodsInRestaurant } from "@/api/get-foods-in-restaurant"; // Import the API function

const Restaurant = () => {
  const { restaurant } = useLocalSearchParams<{
    restaurant: string;
  }>();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  console.log("keyword", keyword);
  // Fetch restaurants using getRestaurants function
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        // Example token and search keyword
        const token = await getJwt(); // Replace with actual JWT token
        const data = await getFoodsInRestaurant(restaurant, token, keyword);

        if (Array.isArray(data)) {
          // @ts-ignore
          setFoods(data);
        } else {
          console.error(data); // Handle the error message
        }
      } catch (error) {
        console.error("Error fetching foods:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [keyword]);

  const handleSearchPress = () => {
    // Handle search functionality
  };

  return (
    <SafeAreaView className="bg-general-500">
      <FlatList
        data={foods} // Display the first 5 restaurants
        renderItem={({ item }) => <FoodCard food={item} />}
        className="px-5"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {!loading ? (
              <>
                <Image
                  source={images.noResult}
                  className="w-40 h-40"
                  alt="No food found"
                  resizeMode="contain"
                />
                <Text className="text-sm">Không tìm thấy món ăn nào</Text>
              </>
            ) : (
              <ActivityIndicator size="large" color="#000" />
            )}
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex flex-row items-center justify-between my-5">
              <Text className="text-2xl font-JakartaSemiBold">
                Chào mừng bạn đến với nhà hàng 👋
              </Text>
            </View>
            <TextInputSearch
              // @ts-ignore
              keyword={keyword}
              setKeyword={setKeyword}
              icons={icons.search}
              containerStyle="bg-white shadow-md shadow-neutral-300"
              handlePress={handleSearchPress}
            />
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default Restaurant;
