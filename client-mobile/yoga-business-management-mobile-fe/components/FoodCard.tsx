import { FoodProps } from "@/types/type";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { icons } from "@/constants";

const FoodCard = ({
  food: {
    id,
    name,
    images,
    description,
    foodCategory,
    creationDate,
    price,
    ingredients,
    seasonal,
    vegetarian,
    available,
  },
}: {
  food: FoodProps;
}) => {
  return (
    <View className="bg-white rounded-lg shadow-lg mb-4 p-4">
      <View className="flex flex-row">
        <Image className="w-24 h-24 rounded-lg" source={{ uri: images[0] }} />
        <View className="ml-4 flex-1">
          <Text className="text-lg font-bold mb-1">{name}</Text>
          <Text className="text-sm text-gray-500 mb-2" numberOfLines={2}>
            {description}
          </Text>
          <Text className="text-md font-medium text-gray-700">{price}đ</Text>
          <TouchableOpacity
            className={"flex flex-row justify-end"}
            onPress={() => Alert.alert("Đã mua hàng")}
          >
            <Image source={icons.add} className="w-6 h-6" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default FoodCard;
