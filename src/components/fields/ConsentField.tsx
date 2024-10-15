import React from "react"
import { View, Text, Switch } from "react-native"
import { FieldComponentProps } from "../../types"
import CommonWrapper from "./CommonWrapper"

const ConsentField: React.FC<FieldComponentProps> = (props) => {
  const { field, value, onValueChange, error, primaryColor, fieldLabelStyle, fieldDescriptionStyle, fieldErrorMessageStyle } = props

  if (field.visibility === "hidden" || field.visibility === "administrative") return null

  const handleValueChange = (newValue: boolean) => {
    onValueChange!({
      checked: newValue ? "1" : "",
      label: field.checkboxLabel
    })
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
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Switch 
          value={value?.checked === "1"} 
          onValueChange={handleValueChange} 
          thumbColor={primaryColor} 
          trackColor={{ false: "#ccc", true: primaryColor }} 
        />
        <Text style={{ marginLeft: 10, ...fieldLabelStyle }}>{field.checkboxLabel}</Text>
      </View>
    </CommonWrapper>
  )
}

export default ConsentField
