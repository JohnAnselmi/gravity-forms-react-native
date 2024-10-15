import React from "react"
import { TextInput } from "react-native"
import { FieldComponentProps } from "../../types"
import CommonWrapper from "./CommonWrapper"

const PhoneField: React.FC<FieldComponentProps> = (props) => {
  const {
    field,
    value,
    onChangeText,
    error,
    primaryColor,
    fieldLabelStyle,
    fieldDescriptionStyle,
    fieldErrorMessageStyle,
    inputTextStyle,
    inputPlaceholderStyle,
    inputBorderColor,
    inputContainerStyle,
  } = props

  if (field.visibility === "hidden" || field.visibility === "administrative") return null

  return (
    <CommonWrapper
      field={field}
      error={error}
      primaryColor={primaryColor}
      fieldLabelStyle={fieldLabelStyle}
      fieldDescriptionStyle={fieldDescriptionStyle}
      fieldErrorMessageStyle={fieldErrorMessageStyle}
    >
      <TextInput
        style={[
          {
            borderWidth: 1,
            borderColor: error ? "red" : inputBorderColor,
            padding: 10,
            borderRadius: 5,
          },
          inputTextStyle,
          inputContainerStyle,
        ]}
        value={value}
        onChangeText={onChangeText!}
        keyboardType="phone-pad"
        placeholder={field.placeholder}
        placeholderTextColor={inputPlaceholderStyle?.color}
      />
    </CommonWrapper>
  )
}

export default PhoneField
