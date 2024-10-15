import React, { useState, useRef } from "react"
import { TextInput, Text } from "react-native"
import { FieldComponentProps } from "../../types"
import CommonWrapper from "./CommonWrapper"

const NumberField: React.FC<FieldComponentProps> = (props) => {
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

  const [localValue, setLocalValue] = useState(value)
  const [isValid, setIsValid] = useState(true)
  const inputRef = useRef<TextInput>(null)

  const min = field.rangeMin !== undefined ? parseFloat(field.rangeMin) : null
  const max = field.rangeMax !== undefined ? parseFloat(field.rangeMax) : null

  const validateNumber = (text: string) => {
    const num = parseFloat(text)
    if (isNaN(num)) {
      setIsValid(false)
      return false
    }
    if ((min !== null && num < min) || (max !== null && num > max)) {
      setIsValid(false)
      return false
    }
    setIsValid(true)
    return true
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
        ref={inputRef}
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
        value={localValue}
        onChangeText={(text) => {
          // Allow only numbers, one decimal point, and minus sign at the start
          const sanitizedText = text
            .replace(/[^0-9.-]/g, "")
            .replace(/(?!^)-/g, "")
            .replace(/(\..*)\./g, "$1")
          setLocalValue(sanitizedText)

          if (validateNumber(sanitizedText)) {
            onChangeText!(sanitizedText)
          }
        }}
        onBlur={() => {
          const isValidNumber = validateNumber(localValue)
          if (isValidNumber) {
            const num = parseFloat(localValue)
            let finalValue = num
            if (min !== null && num < min) finalValue = min
            if (max !== null && num > max) finalValue = max
            const formattedValue = finalValue.toString()
            setLocalValue(formattedValue)
            onChangeText!(formattedValue)
          }
        }}
        keyboardType="numeric"
        placeholderTextColor={inputPlaceholderStyle?.color}
      />
      {!isValid && (
        <Text style={[{ color: "orange", fontSize: 12, marginTop: 3 }, fieldValidationMessageStyle]}>
          {min !== null && max !== null
            ? `Please enter a number between ${min} and ${max}`
            : min !== null
            ? `Please enter a number greater than or equal to ${min}`
            : max !== null
            ? `Please enter a number less than or equal to ${max}`
            : "Please enter a valid number"}
        </Text>
      )}
    </CommonWrapper>
  )
}

export default NumberField
