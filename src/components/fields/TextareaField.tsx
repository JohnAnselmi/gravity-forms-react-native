import React from "react"
import { TextInput } from "react-native"
import { FieldComponentProps } from "../../types"
import CommonWrapper from "./CommonWrapper"

const TextareaField: React.FC<FieldComponentProps> = (props) => {
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
      primaryColor={primaryColor!}
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
            height: 100,
            textAlignVertical: "top",
            paddingTop: 5,
          },
          inputTextStyle,
          inputContainerStyle,
        ]}
        multiline
        value={value}
        onChangeText={onChangeText!}
        placeholderTextColor={inputPlaceholderStyle?.color}
      />
    </CommonWrapper>
  )
}

export default TextareaField
