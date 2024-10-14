import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Button } from "react-native-elements";

const Product = () => {
  const { product } = useLocalSearchParams<{
    product: string;
  }>();

  const [showFullDescription, setShowFullDescription] = useState(false);

  // Dummy data for product details
  const productData = {
    title: "Premium Yoga Mat",
    rating: 4.8,
    reviews: 245,
    shopName: "Yoga Essentials",
    shopImage:
      "https://images.pexels.com/photos/917732/pexels-photo-917732.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Replace with a real image URL
    shopAddress: "123 Yoga St, Wellness City",
    description:
      "This premium yoga mat is made from eco-friendly material, offering comfort and grip for all your yoga sessions. Its non-slip surface is perfect for any style of yoga, whether you are a beginner or an expert. The mat is lightweight, easy to carry, and provides the perfect cushion for your joints. It's the best choice for yogis who care about the environment and need a durable mat for their daily practice.",
    otherProducts: [
      {
        id: 1,
        image:
          "https://images.pexels.com/photos/917732/pexels-photo-917732.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        title: "Yoga Blocks",
        price: "$12",
        rating: 4.5,
        location: "Wellness City",
      },
      {
        id: 2,
        image:
          "https://images.pexels.com/photos/917732/pexels-photo-917732.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        title: "Yoga Strap",
        price: "$8",
        rating: 4.7,
        location: "Wellness City",
      },
      {
        id: 3,
        image:
          "https://images.pexels.com/photos/917732/pexels-photo-917732.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        title: "Yoga Bolster",
        price: "$22",
        rating: 4.3,
        location: "Fitness Town",
      },
      {
        id: 4,
        image:
          "https://images.pexels.com/photos/917732/pexels-photo-917732.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        title: "Yoga Wheel",
        price: "$30",
        rating: 4.9,
        location: "Yoga Ville",
      },
    ],
  };

  return (
    <SafeAreaView className="bg-general-500 flex-1">
      <ScrollView>
        {/* Product Image */}
        <Image
          source={{
            uri: "https://images.pexels.com/photos/917732/pexels-photo-917732.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          }} // Replace with actual product image URL
          className="w-full h-80"
        />

        {/* Title */}
        <View className="p-4">
          <Text className="text-xl font-bold">{productData.title}</Text>

          {/* Rating and Review Section */}
          <View className="flex-row justify-between items-center mt-2">
            <View className="flex-row items-center">
              <FontAwesome name="star" size={16} color="gold" />
              <Text className="ml-1">
                {productData.rating} ({productData.reviews} reviews)
              </Text>
            </View>
            <TouchableOpacity>
              <Text className="text-blue-500">See all reviews</Text>
            </TouchableOpacity>
          </View>

          {/* Example Reviews */}
          <View className="mt-4">
            <Text className="text-base font-semibold">
              User1: Great mat, love the grip and support!
            </Text>
            <Text className="text-base font-semibold mt-2">
              User2: Super comfortable for all my yoga poses!
            </Text>
          </View>

          {/* Product Description */}
          <View className="mt-6">
            <Text numberOfLines={showFullDescription ? undefined : 5}>
              {productData.description}
            </Text>
            <TouchableOpacity
              onPress={() => setShowFullDescription(!showFullDescription)}
            >
              <Text className="text-blue-500 mt-2">
                {showFullDescription ? "Show less" : "Read more"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* "You may also like" Section */}
        <View className="mt-8">
          <Text className="text-xl font-bold px-4">You may also like</Text>

          <View className="flex-row flex-wrap mt-4">
            {productData.otherProducts.map((item) => (
              <View key={item.id} className="w-1/2 p-2">
                <View className="bg-white p-4 rounded-lg">
                  <Image
                    source={{ uri: item.image }}
                    className="w-full h-32 rounded-lg"
                  />
                  <Text className="text-lg font-bold mt-2">{item.title}</Text>
                  <Text className="text-sm text-gray-500">{item.price}</Text>
                  <View className="flex-row items-center mt-1">
                    <FontAwesome name="star" size={14} color="gold" />
                    <Text className="ml-1 text-sm">{item.rating}</Text>
                  </View>
                  <Text className="text-sm text-gray-400 mt-1">
                    {item.location}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View className="flex-row justify-between ">
        <Button
          title="Chat ngay"
          className={"bg-red-500 "}
          onPress={() => console.log("Chat ngay pressed")}
        />
        <Button
          title="Thêm giỏ hàng"
          className="bg-green-500" // Màu xanh lá cây
          onPress={() => console.log("Thêm vào giỏ hàng pressed")}
        />
        <Button
          title="Mua hàng"
          className="bg-orange-500" // Màu cam
          onPress={() => console.log("Mua hàng pressed")}
        />
      </View>
    </SafeAreaView>
  );
};

export default Product;
