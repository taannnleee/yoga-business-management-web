import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

const FooterProductDetailModal = ({
  onChat,
  onAddToCart,
  onBuyWithVoucher,
  setIsModalVisible,
}) => {
  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200">
      {/* Button Chat Ngay */}
      <TouchableOpacity
        onPress={onChat}
        className="flex-row items-center justify-center bg-blue-500 py-3 rounded-lg mb-2"
      >
        <Icon name="message1" size={20} color="white" />
        <Text className="ml-2 text-white font-bold text-sm">Chat Ngay</Text>
      </TouchableOpacity>

      {/* Button Thêm Giỏ Hàng */}
      <TouchableOpacity
        onPress={onAddToCart}
        className="flex-row items-center justify-center bg-green-500 py-3 rounded-lg mb-2"
      >
        <Icon name="shoppingcart" size={20} color="white" />
        <Text className="ml-2 text-white font-bold text-sm">Thêm Giỏ Hàng</Text>
      </TouchableOpacity>

      {/* Button Mua với Voucher */}
      <TouchableOpacity
        onPress={() => {
          onBuyWithVoucher();
          setIsModalVisible(false); // Tắt modal nếu cần
        }}
        className="flex-row items-center justify-center bg-red-500 py-3 rounded-lg"
      >
        <Icon name="tags" size={20} color="white" />
        <Text className="ml-2 text-white font-bold text-sm">
          Mua với Voucher
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FooterProductDetailModal;
