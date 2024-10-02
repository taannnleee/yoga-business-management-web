import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import {
  FlatList,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import ProductCard from "@/components/ProductCard";
import TextInputSearch from "@/components/TextInputSearch";
import { icons, images } from "@/constants";
import { getProducts } from "@/api/get-product";
import { getJwt } from "@/jwt/get-jwt";
import { router } from "expo-router";
import { ProductProps } from "@/types/type";

const Home = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1); // Start from page 1
  const [isLoadingMore, setIsLoadingMore] = useState(false); // For tracking lazy loading state
  const [hasMore, setHasMore] = useState(true); // For tracking if more products are available
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
            // @ts-ignore
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

      // Giả lập việc tải chậm bằng cách thêm thời gian chờ trước khi bắt đầu tải dữ liệu
      setTimeout(() => {
        setPage((prevPage) => prevPage + 1); // Tăng số trang để tải thêm
      }, 1000); // Đặt thời gian chờ 1 giây (1000ms)
    }
  };

  const handleSearchPress = () => {
    // Handle search functionality
  };

  // @ts-ignore
  // @ts-ignore
  return (
    <SafeAreaView className="bg-general-500">
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              router.push(
                // @ts-ignore
                `/(root)/(product)/${item.id}?nameProduct=${item.title}`,
              );
            }}
          >
            <ProductCard product={item} />
          </TouchableOpacity>
        )}
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
            </View>
            <TextInputSearch
              // @ts-ignore
              keyword={keyword}
              setKeyword={setKeyword}
              icon={icons.search}
              containerStyle="bg-white shadow-md shadow-neutral-300"
              handlePress={handleSearchPress}
              setPage={setPage}
              setProducts={setProducts}
            />
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
