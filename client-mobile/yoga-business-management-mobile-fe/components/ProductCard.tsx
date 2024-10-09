import { ProductProps } from "@/types/type";
import { Image, Text, View } from "react-native";
import { icons } from "@/constants";

const ProductCard = ({
  product: { id, price, title, averageRating, productDetail, imagePath },
}: {
  product: ProductProps;
}) => {
  return (
    <View
      className={
        "flex flex-col justify-center items-center bg-white rounded-lg shadow-sm shadow-neutral-300 mb-3"
      }
    >
      {/* Image Full Width */}
      <Image
        className={"w-full h-[150px] rounded-lg"}
        source={{ uri: imagePath }}
      />

      {/* Title and Rating */}
      <View className={"flex flex-col items-start p-3 w-full"}>
        <Text numberOfLines={1} className={"text-lg font-JakartaMedium w-full"}>
          {title}
        </Text>
        <View className={"flex flex-row items-center mt-2"}>
          <Image source={icons.star} className={"w-5 h-5"} />
          <Text numberOfLines={1} className={"text-md font-JakartaMedium"}>
            {averageRating}
          </Text>
          <Text
            className={
              "text-md font-JakartaMedium text-sm text-orange-600 left-10"
            }
          >
            đ{price}
          </Text>
        </View>
      </View>

      {/* Price Section */}
    </View>
  );
};

export default ProductCard;
