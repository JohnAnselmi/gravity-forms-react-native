import React, { useState, useEffect } from "react"
import { TouchableOpacity, View, Text, TextInput } from "react-native"
import { FieldComponentProps } from "../../types"
import CommonWrapper from "./CommonWrapper"

const RadioField: React.FC<FieldComponentProps> = (props) => {
  const {
    field,
    value,
    onValueChange,
    error,
    primaryColor,
    fieldLabelStyle,
    fieldDescriptionStyle,
    fieldErrorMessageStyle,
    inputTextStyle,
    inputBorderColor = "#ccc",
  } = props
  const [otherValue, setOtherValue] = useState("")

  useEffect(() => {
    // If value doesn't match any choice values, it must be an "other" value
    if (value && field.choices?.every((choice) => choice.value !== value)) {
      setOtherValue(value)
    }
  }, [value, field.choices])

  if (field.visibility === "hidden" || field.visibility === "administrative") return null

  const handleOtherValueChange = (text: string) => {
    setOtherValue(text)
    onValueChange!(text)
  }

  return (
    <CommonWrapper
      field={field}
      error={error}
      primaryColor={primaryColor}
      fieldLabelStyle={fieldLabelStyle}
      fieldDescriptionStyle={fieldDescriptionStyle}
      fieldErrorMessageStyle={fieldErrorMessageStyle}
    >
      {field.choices?.map((choice) => (
        <TouchableOpacity
          key={choice.value}
          onPress={() => onValueChange!(choice.value)}
          style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }}
        >
          <View
            style={{
              height: 20,
              width: 20,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: value === choice.value ? primaryColor : "#ccc",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {value === choice.value && <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: primaryColor }} />}
          </View>
          <Text style={{ marginLeft: 10, ...inputTextStyle }}>{choice.text}</Text>
        </TouchableOpacity>
      ))}

      {field.enableOtherChoice && (
        <View>
          <TouchableOpacity
            onPress={() => value !== "gf_other_choice" && onValueChange!("gf_other_choice")}
            style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }}
          >
            <View
              style={{
                height: 20,
                width: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: value === "gf_other_choice" || (value && field.choices?.every((choice) => choice.value !== value)) ? primaryColor : "#ccc",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {(value === "gf_other_choice" || (value && field.choices?.every((choice) => choice.value !== value))) && (
                <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: primaryColor }} />
              )}
            </View>
            <Text style={{ marginLeft: 10, ...inputTextStyle }}>Other</Text>
          </TouchableOpacity>

          {(value === "gf_other_choice" || (value && field.choices?.every((choice) => choice.value !== value))) && (
            <TextInput
              value={otherValue}
              onChangeText={handleOtherValueChange}
              style={{
                marginLeft: 30,
                marginTop: 5,
                padding: 8,
                borderWidth: 1,
                borderColor: inputBorderColor,
                borderRadius: 4,
                ...inputTextStyle,
              }}
              placeholder="Enter other value"
            />
          )}
        </View>
      )}
    </CommonWrapper>
  )
}

export default RadioField
