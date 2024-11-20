import React, { useState, useEffect } from "react";
import { Image, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import IconMaterial from "react-native-vector-icons/AntDesign";
import { useLocalSearchParams } from "expo-router";

const RatingDetail = ({ route }: { route: any }) => {
  const params = useLocalSearchParams();
  const comments = Array.isArray(params.comments)
    ? params.comments
    : JSON.parse(params.comments);
  const [sortedComments, setSortedComments] = useState<any[]>([]); // Ensure it is an array
  const [sortOption, setSortOption] = useState("latest");

  // Hàm sắp xếp comment
  const sortComments = (option: string) => {
    let sorted = [...comments];
    if (option === "latest") {
      sorted.sort((a: any, b: any) => new Date(b.date) - new Date(a.date));
    } else if (option === "oldest") {
      sorted.sort((a: any, b: any) => new Date(a.date) - new Date(b.date));
    } else {
      sorted.sort((a: any, b: any) => b.ratePoint - a.ratePoint);
    }
    setSortedComments(sorted);
    setSortOption(option);
  };

  // Hàm render số sao
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <IconMaterial
        key={i}
        name="star"
        size={18}
        color={i < Math.round(rating) ? "#f44336" : "#e0e0e0"}
      />
    ));
  };

  // Initialize sortedComments when comments are passed
  useEffect(() => {
    if (comments && Array.isArray(comments)) {
      setSortedComments(comments); // Set the initial comments
    }
  }, [comments]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header với nút sort */}
      <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          Tất cả đánh giá
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 10 }}
        >
          {[
            { label: "Mới nhất", value: "latest" },
            { label: "Cũ nhất", value: "oldest" },
            { label: "5 sao", value: "5" },
            { label: "4 sao", value: "4" },
            { label: "3 sao", value: "3" },
            { label: "2 sao", value: "2" },
            { label: "1 sao", value: "1" },
          ].map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() =>
                option.value >= "1" && option.value <= "5"
                  ? setSortedComments(
                      comments.filter(
                        (comment: any) =>
                          comment.ratePoint === parseInt(option.value),
                      ),
                    )
                  : sortComments(option.value)
              }
              style={{
                padding: 10,
                backgroundColor:
                  sortOption === option.value ? "#f44336" : "#e0e0e0",
                borderRadius: 20,
                marginRight: 10,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 14 }}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={{ height: 1, backgroundColor: "#ccc", marginTop: 10 }} />
      </View>

      {/* Danh sách comment */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
        {Array.isArray(sortedComments) && sortedComments.length > 0 ? (
          sortedComments.map((comment: any, index: number) => (
            <View key={index} style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={{
                    uri: comment.user?.imagePath || "DEFAULT_AVATAR_URL",
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                  }}
                />
                <View style={{ marginLeft: 10 }}>
                  <Text style={{ fontWeight: "bold" }}>
                    {comment.user?.fullname || "Ẩn danh"}
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    {renderStars(comment.ratePoint)}
                  </View>
                </View>
              </View>
              <Text style={{ marginTop: 10 }}>{comment.content}</Text>
              {comment.images && comment.images.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginTop: 10 }}
                >
                  {comment.images.map((image: string, imgIndex: number) => (
                    <Image
                      key={imgIndex}
                      source={{ uri: image }}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 8,
                        marginRight: 10,
                      }}
                    />
                  ))}
                </ScrollView>
              )}
              <View
                style={{ height: 1, backgroundColor: "#ccc", marginTop: 10 }}
              />
            </View>
          ))
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Không có đánh giá
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default RatingDetail;
