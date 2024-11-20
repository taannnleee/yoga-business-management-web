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
import ProductRating from "@/app/(root)/(product)/ProductRating";
import Icon from "react-native-vector-icons/AntDesign";
import FooterProductDetailModal from "@/components/organisms/FooterProductDetail";
import { useWindowDimensions } from "react-native";
import RenderHTML from "react-native-render-html";
const ProductDetail = () => {
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  console.log("Product ID:", id);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedImageLeft, setSelectedImageLeft] = useState("");
  const [selectedImageRight, setSelectedImageRight] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [currentVariant, setCurrentVariant] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProductData = async () => {
      if (id) {
        const token = await getJwt(); // Replace with actual JWT token
        const productData = await fetchProductData(id, token);
        if (productData) {
          setSelectedProduct(productData);
          setSelectedImageLeft(productData.imagePath || "");
          setSelectedImage(productData.imagePath || "");

          fetchFavoriteStatus(productData.id, token);
        }
      }
    };

    loadProductData();
  }, [id]);

  // Fetch favorite status from API
  const fetchFavoriteStatus = async (productId: string, token: string) => {
    try {
      console.log("tan1")
      console.log(productId)
      console.log(token)
      const response = await fetch(`${BASE_URL}/api/wishlist/get-wishlist-exists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        setIsLiked(true);
      } else {
        // console.error("Failed to fetch favorite status");
      }
    } catch (error) {
      console.error("Error fetching favorite status:", error);
    }
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible); // Toggle modal visibility
    console.log("Hello");
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

  const handleClickAddToCart = async () => {
    setIsModalVisible(true); // Mở modal khi người dùng nhấn nút "Thêm Giỏ Hàng"

  };

  // add and delete wishlist
  const handleFavoriteToggle = async () => {
    setLoading(true); // Start loading
    try {
      const token = await getJwt(); // Fetch token
      if (isLiked) {
        // Call API to remove from wishlist
        const response = await fetch(`${BASE_URL}/api/wishlist/delete-wishlist-by-product-id/${selectedProduct?.id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsLiked(false);
        } else {
          console.error("Failed to remove from wishlist");
        }
      } else {
        // Call API to add to wishlist
        const response = await fetch(`${BASE_URL}/api/wishlist/add-wishlist`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: selectedProduct?.id }),
        });

        if (response.ok) {
          setIsLiked(true);
        } else {
          console.error("Failed to add to wishlist");
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist status:", error);
    } finally {
      setLoading(false); // Stop loading after API call
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = await getJwt(); // Lấy JWT token từ local storage hoặc context
      const cartData = {
        productId: selectedProduct?.id,
        quantity: quantity,
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
  const toggleLike = () => {
    setIsLiked((prev) => !prev); // Toggle between true and false
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
                      className={`w-12 h-12 rounded-lg ${
                        image === selectedImageLeft
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
              <TouchableOpacity onPress={handleFavoriteToggle}>
                <Icon
                  name={isLiked ? "heart" : "hearto"}
                  size={20}
                  color={isLiked ? "#f44336" : "#ccc"} // Red if liked, gray if not liked
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Rating Section */}
        <View className="mb-6">
          <Text className="text-[14px] font-bold">{selectedProduct.title}</Text>
          {/* Soft gray background with subtle padding for bet`ter separation */}
          <ProductRating selectedProduct={selectedProduct} />
        </View>

        {/* Description Section */}
        <View style={{ marginBottom: 16 }}>
          {selectedProduct.description ? (
            <RenderHTML
              contentWidth={width}
              source={{ html: selectedProduct.description }}
            />
          ) : (
            <Text style={{ fontSize: 14, color: "gray" }}>
              Product details are coming soon.
            </Text>
          )}
        </View>
      </ScrollView>
      <FooterProductDetailModal
        onChat={handleChat}
        onAddToCart={handleClickAddToCart}
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
          handleAddToCart={handleAddToCart}
          setQuantity={setQuantity}
        />
      )}
    </SafeAreaView>
  );
};

export default ProductDetail;
