import React from "react";
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
import CustomNumberInput from "@/components/atoms/CustomNumberInput";
import { Product } from "@/types/product";
import { Variants } from "@/types/variant";

const { height } = Dimensions.get("window");

interface ProductDetailModalProps {
  isVisible: boolean;
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
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isVisible,
  toggleModal,
  selectedProduct,
  selectedImage,
  selectedImageLeft,
  quantity,
  currentVariant,
  handleVariantSelect,
  handleImageLeftClick,
  handleImageRightClick,
}) => {
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
          <View className="bg-white w-full h-3/4 px-5">
            {/* Close button (X) */}
            <TouchableOpacity
              onPress={toggleModal}
              className="absolute top-5 right-5 z-10"
            >
              <Text className="text-3xl text-red-500">×</Text>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={{ marginTop: 50 }}>
              <View className="items-center space-y-4">
                <Image
                  source={{ uri: selectedImage }}
                  className="w-full h-24 rounded-lg"
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
                            className={`w-20 h-20 rounded-lg ${
                              image === selectedImageLeft
                                ? "border-2 border-red-500"
                                : ""
                            }`}
                          />
                        </TouchableOpacity>
                      ),
                    )}
                </View>
                <Text className="text-xl font-bold">
                  {selectedProduct.title}
                </Text>
                <Text className="text-lg text-gray-600">
                  Brand: {selectedProduct.brand}
                </Text>
                <Text className="text-xl text-red-500">
                  {selectedProduct.price.toLocaleString()}₫
                </Text>
                <Text className="text-sm text-gray-700">
                  {selectedProduct.description ||
                    "Product details are coming soon."}
                </Text>

                {selectedProduct.variants &&
                  Object.entries(selectedProduct.variants).map(
                    ([variantType, variantValues]) => (
                      <View key={variantType} className="my-4">
                        <Text className="text-lg font-semibold">
                          {variantType.charAt(0).toUpperCase() +
                            variantType.slice(1)}
                        </Text>
                        <View className="flex-row space-x-4 mt-2">
                          {Object.entries(variantValues).map(
                            ([value, image], index) => (
                              <TouchableOpacity
                                key={index}
                                onPress={() =>
                                  handleVariantSelect(variantType, value, image)
                                }
                                className={`w-20 h-20 flex items-center justify-center ${
                                  value === currentVariant[variantType]?.value
                                    ? "border-2 border-blue-800"
                                    : "border border-gray-300"
                                }`}
                              >
                                {variantType === "color" ? (
                                  <>
                                    <Image
                                      source={{
                                        uri:
                                          image ||
                                          "/path/to/fallback/image.jpg",
                                      }}
                                      className="w-10 h-10 rounded-full"
                                    />
                                    <Text className="text-center">{value}</Text>
                                  </>
                                ) : (
                                  <Text className="text-center">{value}</Text>
                                )}
                              </TouchableOpacity>
                            ),
                          )}
                        </View>
                      </View>
                    ),
                  )}

                <View className="flex-row items-center space-x-4 mt-4">
                  <CustomNumberInput
                    value={quantity}
                    onChange={(newQuantity) => {}}
                  />
                  <Button
                    title="Add to Cart"
                    className="bg-red-500 py-2 px-4 rounded-lg"
                    onPress={toggleModal}
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
