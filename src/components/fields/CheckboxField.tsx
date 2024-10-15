import React from "react"
import { View, Text, Switch } from "react-native"
import { FieldComponentProps } from "../../types"
import CommonWrapper from "./CommonWrapper"

const CheckboxField: React.FC<FieldComponentProps> = (props) => {
  const { field, value, onValueChange, error, primaryColor, fieldLabelStyle, fieldDescriptionStyle, fieldErrorMessageStyle, inputTextStyle } = props

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
      {field.choices?.map((choice) => (
        <View key={choice.value} style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }}>
          <Switch
            value={Array.isArray(value) ? value.includes(choice.value) : value === choice.value}
            onValueChange={(isChecked) => {
              if (field.choices && field.choices.length === 1) {
                // Single checkbox
                onValueChange!(isChecked ? choice.value : "")
              } else {
                // Multi-checkbox
                const newValue = Array.isArray(value) ? value : []
                if (isChecked) {
                  onValueChange!([...newValue, choice.value])
                } else {
                  onValueChange!(newValue.filter((v: string) => v !== choice.value))
                }
              }
            }}
            thumbColor={primaryColor}
            trackColor={{ false: "#ccc", true: primaryColor }}
          />
          <Text style={{ marginLeft: 10, ...inputTextStyle }}>{choice.text}</Text>
        </View>
      ))}
    </CommonWrapper>
  )
}

export default CheckboxField
