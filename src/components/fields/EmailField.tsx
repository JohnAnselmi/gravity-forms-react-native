import React, { useState } from "react"
import { TextInput, Text } from "react-native"
import { FieldComponentProps } from "../../types"
import CommonWrapper from "./CommonWrapper"

const EmailField: React.FC<FieldComponentProps> = (props) => {
  const {
    field,
    value,
    onChangeText,
    error,
    primaryColor,
    fieldLabelStyle,
    fieldDescriptionStyle,
    fieldErrorMessageStyle,
    fieldValidationMessageStyle,
    inputTextStyle,
    inputPlaceholderStyle,
    inputBorderColor,
    inputContainerStyle,
  } = props

  if (field.visibility === "hidden" || field.visibility === "administrative") return null

  const [isValid, setIsValid] = useState(true)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const validateEmail = (email: string) => {
    const isValidEmail = emailRegex.test(email)
    setIsValid(isValidEmail)
    return isValidEmail
  }

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
            borderColor: error ? "red" : isValid ? inputBorderColor : "orange",
            padding: 10,
            borderRadius: 5,
          },
          inputTextStyle,
          inputContainerStyle,
        ]}
        value={value}
        onChangeText={(text) => {
          onChangeText!(text)
          validateEmail(text)
        }}
        onBlur={() => validateEmail(value)}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        placeholder={field.placeholder}
        placeholderTextColor={inputPlaceholderStyle?.color}
      />
      {!isValid && <Text style={[{ color: "orange", fontSize: 12, marginTop: 3 }, fieldValidationMessageStyle]}>Please enter a valid email address</Text>}
    </CommonWrapper>
  )
}

export default EmailField
