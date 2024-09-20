import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { ButtonProps } from "@/types/type";

// Function to get background variant style
const getBgVariantStyle = (variant: ButtonProps["bgVariant"]) => {
  switch (variant) {
    case "danger":
      return "bg-red-500";
    case "secondary":
      return "bg-gray-500";
    case "success":
      return "bg-green-500";
    case "outline":
      return "bg-transparent border-neutral-300 border-[0.5px]";
    default:
      return "bg-[#0286FF]";
  }
};

// Function to get text variant style
const getTextVariantStyle = (variant: ButtonProps["textVariant"]) => {
  switch (variant) {
    case "primary":
      return "text-black";
    case "secondary":
      return "text-gray-100";
    case "danger":
      return "text-red-100";
    case "success":
      return "text-green-100";
    default:
      return "text-white";
  }
};

// Define prop types for the CustomButton component
interface CustomButtonProps {
  onPress: () => void;
  title: string;
  bgVariant?: ButtonProps["bgVariant"];
  textVariant?: ButtonProps["textVariant"];
  iconLeft?: React.ComponentType;
  iconRight?: React.ComponentType;
  className?: string;
}

// CustomButton component using function component approach
const CustomButton: React.FC<CustomButtonProps> = ({
  onPress,
  title,
  bgVariant = "primary",
  textVariant = "default",
  iconLeft: IconLeft,
  iconRight: IconRight,
  className = "",
  ...props
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`w-full rounded-full flex flex-row justify-center items-center shadow-md shadow-neutral-400/70 py-2 ${getBgVariantStyle(bgVariant)} ${className}`}
    {...props}
  >
    {IconLeft && <IconLeft />}
    <Text className={`text-lg font-bold ${getTextVariantStyle(textVariant)}`}>
      {title}
    </Text>
    {IconRight && <IconRight />}
  </TouchableOpacity>
);

export default CustomButton;
