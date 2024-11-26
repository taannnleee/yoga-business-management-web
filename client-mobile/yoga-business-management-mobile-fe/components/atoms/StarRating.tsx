import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/AntDesign"; // Importing AntDesign from react-native-vector-icons

const StarRating = ({ rating, onRatingChange }) => {
  const [currentRating, setCurrentRating] = useState(rating || 0);

  // Function to handle the star click
  const handleStarPress = (index) => {
    setCurrentRating(index + 1); // Update the rating
    onRatingChange(index + 1); // Notify parent component about the rating change
  };

  // Render 5 stars
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {Array.from({ length: 5 }).map((_, index) => (
        <TouchableOpacity key={index} onPress={() => handleStarPress(index)}>
          <Icon
            name={index < currentRating ? "star" : "staro"} // Filled star for rated, outline for unrated
            size={30}
            color={index < currentRating ? "#FFD700" : "#D3D3D3"} // Gold for selected stars, gray for unselected
            style={{ marginRight: 5 }}
          />
        </TouchableOpacity>
      ))}
      <Text style={{ marginLeft: 10, fontSize: 16 }}>{currentRating}/5</Text>
    </View>
  );
};

export default StarRating;
