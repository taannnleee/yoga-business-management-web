import React, { useState } from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";
import { GoogleInputProps } from "@/types/type";
import { icons } from "@/constants"; // Assuming icons is an object with SVGs or image references

const TextInputSearch = ({
  keyword,
  setPage,
  icon,
  setKeyword,
  setProducts,
  setHasMore, // Add this prop
  containerStyle,
}: GoogleInputProps) => {
  const [inputValue, setInputValue] = useState(keyword);

  // Function to handle the "Done" button press
  const handleSubmitEditing = () => {
    setPage(1); // Reset the page to 1
    setProducts([]); // Clear the products list
    setHasMore(true); // Reset hasMore to true for new search
    setKeyword(inputValue); // Set the new keyword
  };

  const handleClear = () => {
    setPage(1); // Reset the page to 1
    setKeyword("");
    setProducts([]);
    setHasMore(true); // Reset hasMore
  };

  return (
    <View
      className={`flex flex-row items-center justify-start relative z-50 rounded-xl ${containerStyle} mb-5`}
    >
      <TextInput
        textAlign={"left"}
        className={`w-full py-2 mx-5`}
        placeholder={"Bạn muốn mua gì"}
        clearButtonMode={"always"}
        value={inputValue}
        onChangeText={(text) => {
          setInputValue(text);
        }}
        onSubmitEditing={handleSubmitEditing} // Handle "Done" button press
      />
      {inputValue.length > 0 && (
        <TouchableOpacity className={"absolute right-2"} onPress={handleClear}>
          <Image source={icons.close} className={"w-5 h-5"} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TextInputSearch;
