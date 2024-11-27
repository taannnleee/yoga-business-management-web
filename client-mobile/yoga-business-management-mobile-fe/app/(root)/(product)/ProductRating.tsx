import React, { useEffect, useState } from "react";
import {
  Image,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import IconMaterial from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "@/api/config";
import { getJwt } from "@/jwt/get-jwt";
import { router, useRouter } from "expo-router";

const ProductRating = ({
  selectedProduct,
}: {
  selectedProduct: { id: string };
}) => {
  const router = useRouter();
  const [listComments, setListComments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();

  const getListComments = async () => {
    try {
      setLoading(true);
      const accessToken = await getJwt();

      const headers: HeadersInit = {};
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await fetch(
        `${BASE_URL}/api/comment/by-product/${selectedProduct.id}`,
        {
          method: "GET",
          headers: headers,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data = await response.json();

      if (data?.status === 200) {
        setListComments(data?.data || []);
      } else {
        console.error(data?.message || "Error fetching comments");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getListComments();
  }, [selectedProduct]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <IconMaterial
        key={i}
        name="star"
        size={18}
        color={i < Math.round(rating) ? "#f44336" : "#e0e0e0"}
      />
    ));
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#f44336" />
      </View>
    );
  }
  const encodedComments = encodeURIComponent(JSON.stringify(listComments));
  return (
    <SafeAreaView className="flex-1">
      <View className="w-full h-24">
        <Text className="text-lg font-bold">Đánh giá sản phẩm</Text>
        <View className="h-[1px] bg-gray-300 my-2" />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
        {listComments.slice(0, 2).map((comment, index) => (
          <View key={index} className="mb-5">
            <View className="flex-row items-center">
              <Image
                source={{
                  uri: comment.user?.imagePath || "DEFAULT_AVATAR_URL",
                }}
                className="w-10 h-10 rounded-full"
              />
              <View className="ml-3">
                <Text className="font-bold">{comment.user?.fullname}</Text>
                <View className="flex-row">
                  {comment.ratePoint !== 0 && renderStars(comment.ratePoint)}
                </View>
              </View>
            </View>
            <Text className="mt-2">{comment.content}</Text>
            {comment.images && comment.images.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mt-3"
              >
                {comment.images.map((image: string, imgIndex: number) => (
                  <Image
                    key={imgIndex}
                    source={{ uri: image }}
                    className="w-15 h-15 mr-3 rounded-md"
                  />
                ))}
              </ScrollView>
            )}
            <View className="h-[1px] bg-gray-300 mt-3" />
          </View>
        ))}
        {listComments.length > 2 && (
          <Button
            title={`Xem tất cả (${listComments.length})`}
            onPress={() =>
              router.push({
                pathname: "/(root)/(rating-detail)/rating",
                params: { comments: encodedComments }, // Use listComments here
              })
            }
            color="#f44336"
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductRating;
