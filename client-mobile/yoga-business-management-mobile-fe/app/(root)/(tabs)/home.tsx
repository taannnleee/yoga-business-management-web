import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SockJS from "sockjs-client";
import ProductCard from "@/components/organisms/ProductCard";
import TextInputSearch from "@/components/molecules/TextInputSearch";
import { icons, images } from "@/constants";
import { getProducts } from "@/api/get-all-product";
import { getJwt } from "@/jwt/get-jwt";
import { router } from "expo-router";
import { ProductProps } from "@/types/type";
import { SliderBestProduct } from "@/components/organisms/SliderBestProduct";
import Icon from "react-native-vector-icons/AntDesign";
import * as Notifications from "expo-notifications";
import { Client } from "@stomp/stompjs";
import { BASE_URL } from "@/api/config";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
const Home = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1); // Start from page 1
  const [isLoadingMore, setIsLoadingMore] = useState(false); // For tracking lazy loading state
  const [hasMore, setHasMore] = useState(true); // For tracking if more products are available
  useEffect(() => {
    // Yêu cầu quyền thông báo khi mở ứng dụng lần đầu
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission for notifications was denied");
      }
    };

    requestPermissions();
  }, []);
  useEffect(() => {
    // Tạo client STOMP
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(`${BASE_URL}/ws`), // Endpoint WebSocket server
      debug: (msg) => console.log("STOMP Debug: ", msg), // Debug log
      reconnectDelay: 5000, // Tự động reconnect sau 5 giây nếu mất kết nối
    });

    // Xử lý khi kết nối thành công
    stompClient.onConnect = () => {
      console.log("WebSocket connected!");

      // Đăng ký vào topic "/topic/admin"
      stompClient.subscribe("/topic/admin", async (message) => {
        console.log("Received message:", message.body); // Hiển thị tin nhắn nhận được
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Thông báo sản phẩm",
            body: message.body,
          },
          trigger: null, // Trigger ngay lập tức
        });
      });

      // Gửi tin nhắn đến server
      stompClient.publish({
        destination: "/app/notify", // Đích server nhận tin
        body: JSON.stringify({ content: "Hello from React Native!" }),
      });
    };

    // Kết nối và xử lý lỗi
    stompClient.onStompError = (frame) => {
      console.error("Broker error:", frame.headers["message"]);
    };

    // Kích hoạt kết nối
    stompClient.activate();

    // Cleanup khi component bị hủy
    return () => {
      if (stompClient.active) {
        stompClient.deactivate();
      }
      console.log("WebSocket connection closed on unmount");
    };
  }, []);
  // Fetch products using getProducts function
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const token = await getJwt(); // Replace with actual JWT token
        const data = await getProducts(page, 5, token, keyword);

        if (Array.isArray(data)) {
          if (data.length > 0) {
            // Append new products to the list
            setProducts((prevProducts) => [...prevProducts, ...data]);
          } else {
            // If no more data is returned, stop loading more
            setHasMore(false);
          }
        } else {
          console.error(data); // Handle the error message
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    };

    fetchProducts();
  }, [page, keyword]);

  // Handle loading more products when reaching the end
  const loadMoreProducts = () => {
    if (!isLoadingMore && hasMore) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setPage((prevPage) => prevPage + 1); // Increase page number to load more products
      }, 1000); // Set a timeout to simulate loading
    }
  };

  const handleSearchPress = () => {
    // You may implement specific search functionality here if needed
  };

  return (
    <SafeAreaView className="bg-general-500">
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            className={"flex w-1/2 px-2"}
            onPress={() => {
              router.push(
                // @ts-ignore
                `/(root)/(product)/${item.id}`,
              );
            }}
          >
            <ProductCard product={item} />
          </TouchableOpacity>
        )}
        numColumns={2}
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
                  alt="No products found"
                  resizeMode="contain"
                />
                <Text className="text-sm">Không tìm thấy sản phẩm nào</Text>
              </>
            ) : (
              <ActivityIndicator size="large" color="#000" />
            )}
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex flex-row items-center justify-between my-5">
              <Text className="text-2xl font-JakartaSemiBold">Chào bạn 👋</Text>

              <TouchableOpacity
                onPress={() => router.push("/(root)/(cart)/page-cart")}
              >
                <Icon name="shoppingcart" size={25} color="black" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  router.push("/(root)/(notification)/page-notification")
                }
              >
                <Icon name="notification" size={25} color="blue" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/(root)/(wishlist)/page-wishlist")}
              >
                <Icon name="heart" size={25} color="red" />
              </TouchableOpacity>
            </View>

            <TextInputSearch
              keyword={keyword}
              setKeyword={setKeyword}
              icon={icons.search}
              containerStyle="bg-white shadow-md shadow-neutral-300"
              handlePress={handleSearchPress}
              setPage={setPage}
              setProducts={setProducts}
              setHasMore={setHasMore} // Add this prop to reset hasMore
            />
            <View className="flex flex-row items-center justify-between">
              <SliderBestProduct />
            </View>
          </>
        )}
        ListFooterComponent={() => {
          if (isLoadingMore) {
            return (
              <View className="flex flex-col items-center justify-center py-5">
                <ActivityIndicator size="small" color="#000" />
              </View>
            );
          }
          return null;
        }}
        onEndReached={loadMoreProducts} // Load more when the end is reached
        onEndReachedThreshold={0.1} // Adjust based on when you want the loading to trigger
      />
    </SafeAreaView>
  );
};

export default Home;
