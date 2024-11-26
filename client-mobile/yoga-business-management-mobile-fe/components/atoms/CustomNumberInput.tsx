import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface CustomNumberInputProps {
  value: number;
  onChange: (newValue: number) => void;
}

const CustomNumberInput: React.FC<CustomNumberInputProps> = ({
  value,
  onChange,
}) => {
  // Function to increment value
  const increment = () => onChange(value + 1);

  // Function to decrement value with a minimum of 1
  const decrement = () => {
    if (value > 1) onChange(value - 1);
  };

  return (
    <View className="flex-row items-center space-x-2 my-2">
      {/* Decrement button */}
      <TouchableOpacity
        onPress={decrement}
        disabled={value <= 1} // Disable when value is 1
        className={`p-2 rounded-full ${value <= 1 ? "bg-gray-300" : "bg-red-500"}`}
      >
        <FontAwesome
          name="minus"
          size={16}
          color={value <= 1 ? "#a1a1a1" : "white"}
        />
      </TouchableOpacity>

      {/* TextInput to display the quantity */}
      <TextInput
        value={String(value)}
        onChangeText={(text) => {
          const numericValue = Math.max(
            1,
            parseInt(text.replace(/[^0-9]/g, "")) || 1,
          ); // Ensure minimum 1
          onChange(numericValue);
        }}
        keyboardType="numeric"
        className="text-center border border-gray-300 rounded-md px-3 py-2 w-16 text-base"
      />

      {/* Increment button */}
      <TouchableOpacity
        onPress={increment}
        className="p-2 bg-green-500 rounded-full"
      >
        <FontAwesome name="plus" size={16} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default CustomNumberInput;
