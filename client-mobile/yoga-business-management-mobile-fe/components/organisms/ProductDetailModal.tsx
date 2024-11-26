import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  Modal,
} from "react-native";
import { Button } from "react-native-elements";
import CustomNumberInput from "@/components/atoms/CustomNumberInput"; // Đảm bảo bạn đã import đúng
import { Product } from "@/types/product";
import { Variants } from "@/types/variant";
import { useWindowDimensions } from "react-native";
import RenderHTML from "react-native-render-html";

const { height } = Dimensions.get("window");

interface ProductDetailModalProps {
  isVisible: boolean;
  setQuantity: React.Dispatch<React.SetStateAction<number>>; // Đảm bảo kiểu của setQuantity đúng
  toggleModal: () => void;
  selectedProduct: Product;
  selectedImage: string;
  selectedImageLeft: string;
  quantity: number;
  currentVariant: Record<string, any>;
  handleVariantSelect: (
    variantType: Variants,
    value: string,
    image: unknown,
  ) => void;
  handleImageLeftClick: (image: string) => void;
  handleImageRightClick: (image: string) => void;
  handleAddToCart: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isVisible,
  toggleModal,
  selectedProduct,
  selectedImage,
  selectedImageLeft,
  quantity, // Lấy quantity từ props
  currentVariant,
  handleVariantSelect,
  handleImageLeftClick,
  handleImageRightClick,
  handleAddToCart,
  setQuantity, // Lấy setQuantity từ props
}) => {
  const { width } = useWindowDimensions();

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity); // Gọi setQuantity từ props để thay đổi quantity trong component cha
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Modal
        visible={isVisible}
        onRequestClose={toggleModal}
        transparent={true} // Set the modal as transparent to allow background content visibility
        animationType="slide" // Slide-up animation for bottom sheet effect
      >
        {/* Background Overlay */}
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              height: "75%",
              paddingHorizontal: 20,
            }}
          >
            {/* Close button (X) */}
            <TouchableOpacity
              onPress={toggleModal}
              style={{ position: "absolute", top: 20, right: 20 }}
            >
              <Text style={{ fontSize: 30, color: "red" }}>×</Text>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={{ marginTop: 50 }}>
              <View style={{ alignItems: "center", spaceY: 10 }}>
                <Image
                  source={{ uri: selectedImage }}
                  style={{ width: "100%", height: 150, borderRadius: 10 }}
                  resizeMode="cover"
                />
                <View style={{ flexDirection: "row", marginTop: 20 }}>
                  {selectedProduct.variants?.color &&
                    Object.entries(selectedProduct.variants.color).map(
                      ([, image], index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => handleImageLeftClick(image)}
                        >
                          <Image
                            source={image ? { uri: image } : {}}
                            style={{
                              width: 50,
                              height: 50,
                              borderRadius: 10,
                              borderWidth: image === selectedImageLeft ? 2 : 0,
                              borderColor: "red",
                            }}
                          />
                        </TouchableOpacity>
                      ),
                    )}
                </View>
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}
                >
                  {selectedProduct.title}
                </Text>
                <Text style={{ fontSize: 16, color: "gray" }}>
                  Brand: {selectedProduct.brand}
                </Text>
                <Text style={{ fontSize: 20, color: "red", marginTop: 10 }}>
                  {selectedProduct.price.toLocaleString()}₫
                </Text>
                {/*<View style={{ marginBottom: 16 }}>*/}
                {/*  {selectedProduct.description ? (*/}
                {/*    <RenderHTML*/}
                {/*      contentWidth={width}*/}
                {/*      source={{ html: selectedProduct.description }}*/}
                {/*    />*/}
                {/*  ) : (*/}
                {/*    <Text style={{ fontSize: 14, color: "gray" }}>*/}
                {/*      Product details are coming soon.*/}
                {/*    </Text>*/}
                {/*  )}*/}
                {/*</View>*/}

                {selectedProduct.variants &&
                  Object.entries(selectedProduct.variants).map(
                    ([variantType, variantValues]) => (
                      <View key={variantType} style={{ marginTop: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                          {variantType.charAt(0).toUpperCase() +
                            variantType.slice(1)}
                        </Text>
                        <View style={{ flexDirection: "row", marginTop: 10 }}>
                          {Object.entries(variantValues).map(
                            ([value, image], index) => (
                              <TouchableOpacity
                                key={index}
                                onPress={() =>
                                  handleVariantSelect(variantType, value, image)
                                }
                                style={{
                                  width: 50,
                                  height: 50,
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderWidth:
                                    value === currentVariant[variantType]?.value
                                      ? 2
                                      : 1,
                                  borderColor:
                                    value === currentVariant[variantType]?.value
                                      ? "blue"
                                      : "gray",
                                  marginRight: 10,
                                  borderRadius: 10,
                                }}
                              >
                                {variantType === "color" ? (
                                  <>
                                    <Image
                                      source={{
                                        uri:
                                          image ||
                                          "/path/to/fallback/image.jpg",
                                      }}
                                      style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: 15,
                                      }}
                                    />
                                    <Text style={{ textAlign: "center" }}>
                                      {value}
                                    </Text>
                                  </>
                                ) : (
                                  <Text style={{ textAlign: "center" }}>
                                    {value}
                                  </Text>
                                )}
                              </TouchableOpacity>
                            ),
                          )}
                        </View>
                      </View>
                    ),
                  )}

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 20,
                    marginBottom: 60,
                  }}
                >
                  <CustomNumberInput
                    value={quantity}
                    onChange={handleQuantityChange}
                  />
                  <Button
                    title="Add to Cart"
                    containerStyle={{ marginLeft: 20 }}
                    buttonStyle={{
                      backgroundColor: "red",
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                    }}
                    onPress={handleAddToCart}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProductDetailModal;
