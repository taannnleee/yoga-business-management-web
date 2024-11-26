import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import React from "react";
import { InputFieldProps } from "@/types/type";

const InputField = ({
  label,
  labelStyle,
  icon,
  secureTextEntry = false,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  ...props
}: InputFieldProps) => (
  <KeyboardAvoidingView
    behavior={Platform.OS === "android" ? "padding" : "height"}
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className={"my-0.25 w-full"}>
        <Text
          className={`text-lg font-JakartaSemiBold mb-3 ${labelStyle}`}
        ></Text>
        <View
          className={`flex flex-row justify-start items-center relative" +
                "bg-neutral-100 rounded-full border border-neutral-100 focus:border-primary-500" +
                "${containerStyle}`}
        >
          {icon && (
            <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`} />
          )}
          <TextInput
            secureTextEntry={secureTextEntry}
            className={`rounded-full p-4 font-JakartaSemiBold text-[15px] flex-1 text-left ${inputStyle}`}
            {...props}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
);
export default InputField;
