import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Button,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getJwt } from "@/jwt/get-jwt";
import { BASE_URL } from "@/api/config";

const Activity = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (index: number) => {
    setSelectedTab(index);
  };

  const getStatusByTabIndex = (index: number) => {
    switch (index) {
      case 1:
        return "DELIVERING";
      case 2:
        return "PROCESSING";
      case 3:
        return "COMPLETED";
      case 4:
        return "CANCELLED";
      default:
        return "ALL";
    }
  };

  useEffect(() => {
    const fetchOrderData = async (status: string) => {
      setLoading(true);
      try {
        const token = await getJwt();
        const response = await fetch(
          `${BASE_URL}/api/order/get-all-order-by-status/${status}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setOrderData(data.data);
      } catch (error) {
        console.error("Error fetching order data:", error);
      } finally {
        setLoading(false);
      }
    };

    const status = getStatusByTabIndex(selectedTab);
    fetchOrderData(status);
  }, [selectedTab]);

  const getVariantValues = (variants: any) => {
    if (!variants) {
      return "No variants available";
    }

    const values = Object.keys(variants).map((variantType) => {
      const variantDetails = variants[variantType];
      const value = variantDetails?.value || "N/A";
      return `${variantType}: ${value}`;
    });

    return values.join(", ");
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center p-4">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="text-xl mt-2">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4">
      {/* Tabs for Order Types */}
      <View className="flex-row justify-between mb-6">
        <TouchableOpacity
          onPress={() => handleTabChange(0)}
          className={`p-2 ${selectedTab === 0 ? "border-b-2 border-blue-500" : ""}`}
        >
          <Text className="text-lg font-bold">Tất cả</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleTabChange(1)}
          className={`p-2 ${selectedTab === 1 ? "border-b-2 border-blue-500" : ""}`}
        >
          <Text className="text-lg font-bold">Đang giao</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleTabChange(2)}
          className={`p-2 ${selectedTab === 2 ? "border-b-2 border-blue-500" : ""}`}
        >
          <Text className="text-lg font-bold">Đang xử lý</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleTabChange(3)}
          className={`p-2 ${selectedTab === 3 ? "border-b-2 border-blue-500" : ""}`}
        >
          <Text className="text-lg font-bold">Thành công</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleTabChange(4)}
          className={`p-2 ${selectedTab === 4 ? "border-b-2 border-blue-500" : ""}`}
        >
          <Text className="text-lg font-bold">Đã hủy</Text>
        </TouchableOpacity>
      </View>

      {/* Order Information */}
      <FlatList
        data={orderData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="mb-5 bg-white rounded-lg shadow-lg p-4">
            <View className="flex-row justify-between">
              <Text>
                Mã đơn hàng: {item.id} | Người đặt: {item.createdBy}
              </Text>
              <Text>{item.estatusOrder}</Text>
            </View>
            <Text>
              Thanh toán: {item.payment.nameMethod} | Tổng số lượng:{" "}
              <Text className="font-bold">{item.totalItem}</Text> | Tổng tiền:{" "}
              <Text className="font-bold">{item.totalPrice}</Text>
            </Text>

            {/* Accordion for Order Items */}
            {item.orderItems && item.orderItems.length > 0 ? (
              item.orderItems.map((orderItem) => (
                <View key={orderItem.id} className="flex-row mt-3">
                  <Image
                    source={{ uri: orderItem.product.imagePath }}
                    className="w-20 h-20 mr-4"
                  />
                  <View className="flex-1">
                    <Text className="font-bold">{orderItem.name}</Text>
                    <Text>Số lượng: {orderItem.quantity}</Text>
                    <Text className="text-red-500">
                      Giá: {orderItem.totalPrice}
                    </Text>
                    <Text className="text-green-500">
                      {getVariantValues(orderItem.currentVariant)}
                    </Text>
                  </View>
                  <Button title="Mua lại" onPress={() => alert("Buy Again")} />
                </View>
              ))
            ) : (
              <Text>Không có sản phẩm nào trong đơn hàng.</Text>
            )}
          </View>
        )}
        ListEmptyComponent={<Text>Không có đơn hàng nào.</Text>}
      />
    </SafeAreaView>
  );
};

export default Activity;
