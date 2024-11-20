import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Button } from "react-native-elements";
import CustomNumberInput from "@/components/atoms/CustomNumberInput";
import { BASE_URL } from "@/api/config";
import { Product } from "@/types/product";
import { Variants } from "@/types/variant";
import { fetchProductData } from "@/api/product-detail";
import { getJwt } from "@/jwt/get-jwt";
import ProductDetailModal from "@/components/organisms/ProductDetailModal";
import ProductRating from "@/components/organisms/ProductRating";
import Icon from "react-native-vector-icons/AntDesign";
import FooterProductDetailModal from "@/components/organisms/FooterProductDetail";

const ProductDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  console.log("Product ID:", id);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedImageLeft, setSelectedImageLeft] = useState("");
  const [selectedImageRight, setSelectedImageRight] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [currentVariant, setCurrentVariant] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const loadProductData = async () => {
      if (id) {
        const token = await getJwt(); // Replace with actual JWT token
        const productData = await fetchProductData(id, token);
        if (productData) {
          setSelectedProduct(productData);
          setSelectedImageLeft(productData.imagePath || "");
          setSelectedImage(productData.imagePath || "");
        }
      }
    };

    loadProductData();
  }, [id]);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible); // Toggle modal visibility
    console.log(isModalVisible);
    console.log("Hello");
  };

  const handleVariantSelect = (
    variantType: Variants,
    value: string,
    image: unknown,
  ) => {
    setCurrentVariant((prevState) => ({
      ...prevState,
      [variantType]: { value, image },
    }));
    if (variantType === "color") {
      handleImageRightClick(image);
    }
  };
  const handleChat = () => {
    console.log("Chat ngay!");
  };

  const handleAddToCart = async () => {
    setIsModalVisible(true); // Mở modal khi người dùng nhấn nút "Thêm Giỏ Hàng"

    // Tiến hành gọi API ở đây
    try {
      const token = await getJwt(); // Lấy JWT token từ local storage hoặc context
      const cartData = {
        productId: selectedProduct?.id,
        quantity,
        currentVariant: currentVariant, // Các variant sản phẩm nếu có
      };

      // Gọi API thêm vào giỏ hàng
      const response = await fetch(`${BASE_URL}/api/cart/add-to-cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cartData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Sản phẩm đã được thêm vào giỏ hàng:", data);
        // Bạn có thể hiển thị thông báo thành công cho người dùng ở đây
        // Sau khi thêm sản phẩm vào giỏ hàng, có thể đóng modal
        setIsModalVisible(false);
      } else {
        throw new Error("Lỗi khi thêm sản phẩm vào giỏ hàng");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Hiển thị thông báo lỗi nếu có
      alert("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng");
    }
  };

  const handleBuyWithVoucher = () => {
    console.log("Mua với Voucher!");
  };
  const handleImageLeftClick = (image) => {
    setSelectedImageLeft(image);
    setSelectedImage(image);
  };

  const handleImageRightClick = (image) => {
    setSelectedImageRight(image);
    setSelectedImage(image);
  };

  if (!selectedProduct) return <Text>Loading...</Text>;

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScrollView className="px-4">
        {/* Intro Section */}
        <View className="mb-6">
          <Image
            source={{ uri: selectedImage }}
            className="w-full h-64 rounded-lg"
            resizeMode="cover"
          />
          <View className="flex-row space-x-4 mt-4">
            {selectedProduct.variants?.color &&
              Object.entries(selectedProduct.variants.color).map(
                ([color, image], index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleImageLeftClick(image)}
                  >
                    <Image
                      source={{
                        uri: image || "/path/to/fallback/image.jpg",
                      }}
                      className={`w-12 h-12 rounded-lg ${image === selectedImageLeft
                        ? "border-2 border-red-500"
                        : ""
                        }`}
                    />
                  </TouchableOpacity>
                ),
              )}
          </View>
          <View className="flex-row items-center justify-between my-4">
            <View className="flex-row">
              <Text className="text-xl text-red-500 font-bold">
                {selectedProduct.price.toLocaleString()}₫
              </Text>
              <Text className="text-[16px] text-gray-500 line-through ml-2 mt-1">
                {selectedProduct.price.toLocaleString()}₫
              </Text>
              <Text className="text-[12px] text-red-500 font-bold ml-4 mt-2">
                -0%
              </Text>
            </View>
            <View className="flex-row space-x-2">
              <Text className="text-sm">Đã bán 7,3k</Text>
              <Icon name={"hearto"} size={20} color={"#f44336"} />
            </View>
          </View>
        </View>

        {/* Rating Section */}
        <View className="mb-6">
          <Text className="text-[14px] font-bold">{selectedProduct.title}</Text>
          {/* Soft gray background with subtle padding for bet`ter separation */}
          <ProductRating averageRating={selectedProduct.averageRating} />
        </View>

        {/* Description Section */}
        <View className="mb-6">
          <Text className="text-sm text-gray-700">
            {selectedProduct.description || "Product details are coming soon."}
          </Text>
        </View>
      </ScrollView>
      <FooterProductDetailModal
        onChat={handleChat}
        onAddToCart={handleAddToCart}
        onBuyWithVoucher={handleBuyWithVoucher}
        setIsModalVisible={setIsModalVisible}
      />
      {isModalVisible && (
        <ProductDetailModal
          isVisible={isModalVisible}
          toggleModal={toggleModal}
          selectedProduct={selectedProduct}
          selectedImage={selectedImage}
          selectedImageLeft={selectedImageLeft}
          quantity={quantity}
          currentVariant={currentVariant}
          handleVariantSelect={handleVariantSelect}
          handleImageLeftClick={handleImageLeftClick}
          handleImageRightClick={handleImageRightClick}
        />
      )}
    </SafeAreaView>
  );
};

export default ProductDetail;
