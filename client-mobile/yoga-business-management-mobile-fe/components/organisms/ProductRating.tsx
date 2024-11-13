import { ProductProps } from "@/types/type";
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import IconMaterial from "react-native-vector-icons/AntDesign";
// Constants
const { width } = Dimensions.get("window");

const ProductRating = ({ product }: ProductProps) => {
  // Example data
  const ratings = [
    {
      id: 1,
      rating: 4.9,
      totalReviews: 1000,
      userName: "John Doe",
      review:
        "Đã nhận được hàng thảm yoga định tuyến, màu hồng rất đẹp, bắt mắt (Vừa)",
      images: [
        "https://images.pexels.com/photos/268134/pexels-photo-268134.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "https://images.pexels.com/photos/1472887/pexels-photo-1472887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "https://images.pexels.com/photos/317157/pexels-photo-317157.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      ],
    },
    {
      id: 2,
      rating: 4.8,
      totalReviews: 1000,
      userName: "Jane Doe",
      review: "Không ngờ giá rẻ mua được hàng chất lượng đến vậy",
      images: [
        "https://images.pexels.com/photos/3094230/pexels-photo-3094230.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "https://images.pexels.com/photos/3094230/pexels-photo-3094230.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "https://images.pexels.com/photos/3094230/pexels-photo-3094230.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      ],
    },
  ];

  const renderStars = (rating: number) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <IconMaterial
          key={i}
          name="star"
          size={18}
          color={i <= Math.round(rating) ? "#f44336" : "#e0e0e0"}
        />,
      );
    }
    return stars;
  };

  return (
    <SafeAreaView className="flex-1">
      {/* Rating section */}
      <View className="w-full h-24">
        <Text className="text-lg font-bold">Đánh giá sản phẩm</Text>
        <View className="flex-row items-center justify-between mt-2">
          {/* Render rating stars */}
          <View className="flex-row">{renderStars(ratings[0]?.rating)}</View>
          <Text className="text-sm text-red-500">
            {ratings[0]?.rating}/5 ({ratings[0]?.totalReviews} đánh giá)
          </Text>
          <TouchableOpacity>
            <View className="text-sm mt-[-32px] flex-row">
              <Text className={"text-red-500"}>Xem tất cả</Text>
              <IconMaterial name={"right"} size={20} color={"#f44336"} />
            </View>
          </TouchableOpacity>
        </View>
        {/* Horizontal line separator */}
        <View className="h-[1px] bg-gray-300 my-2" />
      </View>

      {/* Reviews Section */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
        {ratings.slice(0, 2).map((rating) => (
          <View key={rating.id} className="mb-5">
            <View className="flex-row items-center">
              {/* User Image */}
              <Image
                source={{ uri: rating.images[0] }}
                className="w-10 h-10 rounded-full"
              />
              <View className="ml-3">
                {/* User Name */}
                <Text className="font-bold">{rating.userName}</Text>
                {/* Rating */}
                <View className="flex-row">{renderStars(rating.rating)}</View>
              </View>
            </View>
            {/* Review Text */}
            <Text className="mt-2">{rating.review}</Text>
            {/* Xem thêm */}
            <TouchableOpacity>
              <Text className="text-sm text-gray-500 mt-2">Xem thêm</Text>
            </TouchableOpacity>

            {/* Review Images */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mt-3"
            >
              {rating.images.slice(0, 3).map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  className="w-15 h-15 mr-3 rounded-md"
                />
              ))}
            </ScrollView>
            {/* Separator after each review */}
            <View className="h-[1px] bg-gray-300" />
          </View>
        ))}
      </ScrollView>

      {/* See all reviews link */}
      <View className="h-4 justify-center items-center my-4">
        <TouchableOpacity>
          <View className="text-sm mt-[-32px] flex-row">
            <Text className={"text-red-500"}>
              Xem tất cả ({ratings[0]?.totalReviews})
            </Text>
            <IconMaterial name={"right"} size={20} color={"#f44336"} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default ProductRating;
