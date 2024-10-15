import React from "react"
import { TouchableOpacity, View, Text } from "react-native"
import { FieldComponentProps } from "../../types"
import CommonWrapper from "./CommonWrapper"

const RadioField: React.FC<FieldComponentProps> = (props) => {
  const { field, value, onValueChange, error, primaryColor, fieldLabelStyle, fieldDescriptionStyle, fieldErrorMessageStyle, inputTextStyle } = props

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
    </CommonWrapper>
  )
}

export default RadioField
