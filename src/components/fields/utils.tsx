import React from "react"
import { TextInput, TextStyle, ViewStyle } from "react-native"
import { GravityFormFieldInput } from "../../types"

export const renderSubInput = (
  input: GravityFormFieldInput,
  value: any,
  onChangeText: (text: any) => void,
  inputTextStyle: TextStyle,
  inputPlaceholderStyle: TextStyle,
  inputBorderColor: string,
  inputContainerStyle: ViewStyle
) => {
  if (input.isHidden) return null
  return (
    <TextInput
      key={input.id}
      style={[
        {
          borderWidth: 1,
          borderColor: inputBorderColor,
          padding: 10,
          borderRadius: 5,
          marginBottom: 5,
          marginTop: 5,
        },
        inputTextStyle,
        inputContainerStyle,
      ]}
      value={value[input.id] || ""}
      onChangeText={(text) => onChangeText({ ...value, [input.id]: text })}
      placeholder={input.label}
      placeholderTextColor={inputPlaceholderStyle.color}
    />
  )
}
