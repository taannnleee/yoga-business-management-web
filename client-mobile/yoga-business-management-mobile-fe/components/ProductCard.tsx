import { ProductProps } from "@/types/type";
import { Image, Text, View } from "react-native";
import { icons } from "@/constants";

const ProductCard = ({
  product: { id, title, averageRating, productDetail },
}: {
  product: ProductProps;
}) => {
  return (
    <View
      className={
        "flex flex-row justify-center items-center bg-white rounded-lg shadow-sm shadow-neutral-300 mb-3"
      }
    >
      <View className={"flex flex-col items-center justify-center p-3"}>
        <View className={"flex flex-row items-center justify-between"}>
          <Image
            className={"w-[80px] h-[90px] rounded-lg"}
            source={{ uri: productDetail.imagePath }}
          />
          <View className={"flex flex-col mx-5 gap-y-5 flex-1"}>
            <View className={"flex flex-row items-center gap-x-2"}>
              <Text numberOfLines={1} className={"text-md font-JakartaMedium"}>
                {title}
              </Text>
            </View>
            <View className={"flex flex-row items-center gap-x-2"}>
              <Image source={icons.star} className={"w-5 h-5"} />
              <Text numberOfLines={1} className={"text-md font-JakartaMedium"}>
                {averageRating}
              </Text>
            </View>
          </View>
        </View>
        <View
          className={
            "flex flex-col w-full mt-5 bg-general-500 rounded-lg p-3 items-start justify-center"
          }
        >
          <View
            className={"flex flex-row items-center w-full justify-between mb-5"}
          >
            <Text className={"text-md font-JakartaMedium text-gray-500 "}>
              Giá
            </Text>
            <Text className={"text-md font-JakartaMedium text-gray-500 "}>
              đ{productDetail.price}
            </Text>
          </View>

          {/*<View*/}
          {/*  className={"flex flex-row items-center w-full justify-between mb-5"}*/}
          {/*>*/}
          {/*  <Text className={"text-md font-JakartaMedium text-gray-500 "}>*/}
          {/*    Loại món ăn*/}
          {/*  </Text>*/}
          {/*  <Text className={"text-md font-JakartaMedium text-gray-500 "}>*/}
          {/*    {cuisineType}*/}
          {/*  </Text>*/}
          {/*</View>*/}
        </View>
      </View>
    </View>
  );
};

export default ProductCard;
