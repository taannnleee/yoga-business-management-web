import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { getJwt } from "@/jwt/get-jwt";
import { BASE_URL } from "@/api/config";
import InputField from "@/components/atoms/InputField";
import CustomButton from "@/components/atoms/CustomButton";
import StarRating from "@/components/atoms/StarRating";
import { router } from "expo-router";

const Activity = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("Ngày mới nhất");
  const [sortDirection, setSortDirection] = useState("desc"); // Added state for sort direction
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);

  // Handle Sort Change with sortDirection state
  const handleSortChange = (item) => {
    setSortOrder(item.label);
    const direction = item.value === "latest" ? "desc" : "asc"; // "Ngày mới nhất" -> desc, "Ngày cũ nhất" -> asc
    setSortDirection(direction); // Update sort direction
    setPage(1); // Reset page to 1
    fetchOrderData(getStatusByTabIndex(selectedTab), direction, 1); // Fetch orders with new sort direction
  };

  // Fetch Order Data Function
  const fetchOrderData = async (status, sortDirection, page) => {
    setLoading(true);
    setRefreshing(true);

    try {
      const token = await getJwt();
      const response = await fetch(
        `${BASE_URL}/api/order/get-all-order-by-status/${status}?page=${page}&sortDir=${sortDirection}`, // Corrected query params
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      setOrderData((prevData) =>
        page === 1 ? data?.data.content : [...prevData, ...data?.data.content],
      );
    } catch (error) {
      console.error("Error fetching order data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch data when tab changes
  useEffect(() => {
    const status = getStatusByTabIndex(selectedTab);
    fetchOrderData(status, sortDirection, 1);

    // Reset review and rating when tab changes
    setReview("");
    setRating(0);
  }, [selectedTab, sortDirection]); // Dependency added for sortDirection

  // Handle keyboard visibility
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Tab change handler
  const handleTabChange = (index) => {
    setSelectedTab(index);
  };

  // Handle review submission
  const handleReviewSubmit = async (orderItem) => {
    if (review.trim() === "") {
      Alert.alert("Lỗi", "Vui lòng nhập đánh giá trước khi gửi!");
      return;
    }

    if (rating === 0) {
      Alert.alert("Lỗi", "Vui lòng chọn số sao trước khi gửi!");
      return;
    }

    try {
      const accessToken = await getJwt();

      // Send comment to the API
      const commentResponse = await fetch(`${BASE_URL}/api/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          content: review,
          ratePoint: rating,
          productId: orderItem.product.id,
        }),
      });

      const commentData = await commentResponse.json();

      if (commentResponse.status !== 200) {
        Alert.alert("Lỗi", commentData.message || "Không thể thêm đánh giá!");
        return;
      }

      const newCommentId = commentData.data.id;

      // Update order with the new comment
      const updateResponse = await fetch(
        `${BASE_URL}/api/order/update-comment/${orderItem.id}?commentId=${newCommentId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const updateData = await updateResponse.json();

      Alert.alert("Thành công", "Đánh giá của bạn đã được gửi!");

      // Reset review and rating after successful submission
      setReview("");
      setRating(0);
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi gửi đánh giá!");
    }
  };

  // Get the status based on the tab index
  const getStatusByTabIndex = (index) => {
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

  const getVariantValues = (variants) => {
    if (!variants) return "Không có";
    return Object.keys(variants)
      .map((key) => `${key}: ${variants[key]?.value || "N/A"}`)
      .join(", ");
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang tải dữ liệu...</Text>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 p-4 mb-16">
        {/* Tabs */}
        {!keyboardVisible && (
          <>
            <View className="flex-row justify-between mb-4">
              {[
                "Tất cả",
                "Đang giao",
                "Đang xử lý",
                "Thành công",
                "Đã hủy",
              ].map((tab, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleTabChange(index)}
                  className={`p-2 ${
                    selectedTab === index ? "border-b-2 border-blue-500" : ""
                  }`}
                >
                  <Text className="text-lg font-bold">{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Dropdown Sort */}
            <View className="relative">
              <DropDownPicker
                open={dropdownOpen}
                value={sortOrder}
                items={[
                  { label: "Ngày mới nhất", value: "latest" },
                  { label: "Ngày cũ nhất", value: "oldest" },
                ]}
                setOpen={setDropdownOpen}
                setValue={setSortOrder}
                onSelectItem={handleSortChange}
                containerStyle={{ width: 150 }}
                style={{ backgroundColor: "white" }}
                dropDownStyle={{ backgroundColor: "white" }}
                placeholder="Sắp xếp"
              />
            </View>
          </>
        )}

        {/* Orders */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <FlatList
            data={orderData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View className="mb-4 bg-white rounded-lg shadow p-4">
                <Text>
                  Mã đơn: {item.id} | Người đặt: {item.createdBy}
                </Text>
                <Text>Thanh toán: {item.payment?.nameMethod}</Text>
                <Text>
                  Số lượng: {item.totalItem} | Tổng tiền: {item.totalPrice}
                </Text>

                {/* Order Items */}
                {item.orderItems?.map((orderItem) => (
                  <TouchableOpacity
                    onPress={() =>
                      router.push(`/(root)/(product)/${orderItem.product.id}`)
                    }
                  >
                    <View key={orderItem.id} className="flex-row mt-3">
                      <Image
                        source={{ uri: orderItem.product?.imagePath }}
                        className="w-20 h-20 mr-4"
                      />
                      <View className="flex-1">
                        <Text>{orderItem.name}</Text>
                        <Text>Số lượng: {orderItem.quantity}</Text>
                        <Text>
                          {getVariantValues(orderItem.currentVariant)}
                        </Text>

                        {/* Review */}
                        {selectedTab === 3 && orderItem?.comment == null && (
                          <>
                            <InputField
                              value={review}
                              onChangeText={setReview}
                              placeholder="Nhập đánh giá..."
                            />
                            <StarRating
                              rating={rating}
                              onRatingChange={setRating}
                            />
                            <CustomButton
                              title="Gửi đánh giá"
                              onPress={() => handleReviewSubmit(orderItem)}
                            />
                          </>
                        )}

                        {selectedTab === 3 && orderItem?.comment != null && (
                          <>
                            <Text className="text-xl font-bold m-4">
                              {orderItem.comment.content}
                            </Text>
                            <StarRating rating={orderItem.comment.ratePoint} />
                          </>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            // onEndReached={() => {
            //   if (!loading) {
            //     setPage(page + 1);
            //     fetchOrderData(
            //       getStatusByTabIndex(selectedTab),
            //       sortDirection,
            //       page + 1,
            //     );
            //   }
            // }}
            onEndReachedThreshold={0.1}
            refreshing={refreshing}
            onRefresh={() => {
              setPage(1);
              fetchOrderData(
                getStatusByTabIndex(selectedTab),
                sortDirection,
                1,
              );
            }}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Activity;
