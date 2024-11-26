import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getProducts } from "@/api/get-all-product";
import { ProductProps } from "@/types/type";
import { getJwt } from "@/jwt/get-jwt";
import { router } from "expo-router";
import { BASE_URL } from "@/api/config";

interface SliderBestProductProps {
  token: string | null; // Allow token to be string or null
}

export const SliderBestProduct = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true); // State to track loading status

  // Fetch the top-selling products
  useEffect(() => {
    const fetchProducts = async () => {
      const token = await getJwt(); // Get the JWT token
      setLoading(true); // Start loading

      try {
        const response = await fetch(`${BASE_URL}/api/product/top-selling`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Pass token for authentication
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProducts(data.data); // Assuming `data.data` contains the product array
        } else {
          console.error("Failed to fetch products:", response.status);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchProducts();
  }, []);

  // Get the screen width
  const screenWidth = Dimensions.get("window").width;

  // Calculate item width for 2.5 items
  const itemWidth = screenWidth / 2.5;

  if (loading) {
    return (
      <View className="flex mx-auto">
        <ActivityIndicator size="small" color="#000" />
      </View>
    );
  }

  return (
    <View className="my-2">
      <Text className="text-lg font-bold mb-3 uppercase">
        Sản phẩm bán chạy nhất
      </Text>
      <FlatList
        data={products}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="mx-2"
            onPress={() => {
              router.push(
                // @ts-ignore
                `/(root)/(product)/${item.id}?nameProduct=${item.title}`,
              );
            }}
            style={{ width: itemWidth }} // Set the width of each item
          >
            <View className="bg-white p-3 rounded-lg shadow-md">
              <Image
                source={{ uri: item.imagePath }}
                className="w-full h-32 mb-2" // Set the image width to 100%
                resizeMode="contain"
              />
              <Text className="text-center font-semibold text-orange-600">
                {item.title}
              </Text>
              <Text className="text-center text-red-600 font-semibold">
                đ{item.price}
              </Text>{" "}
              {/* Giá màu đỏ */}
              <Text className="text-center text-gray-700">
                Số lượng: {item.sold.toString()}
              </Text>
              {/* Hiển thị số lượng sản phẩm */}
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        showsHorizontalScrollIndicator={false}
      />
      <Text className="text-lg font-bold mb-3 uppercase my-5">
        Gợi ý hôm nay
      </Text>
    </View>
  );
};
