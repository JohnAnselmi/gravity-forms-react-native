import React, { FC, ReactNode } from "react"
import { View, Text, TextStyle } from "react-native"
import { GravityFormField } from "../../types"

interface CommonWrapperProps {
  field: GravityFormField
  error?: string
  primaryColor: string
  fieldLabelStyle?: TextStyle
  fieldDescriptionStyle?: TextStyle
  fieldErrorMessageStyle?: TextStyle
  fieldValidationMessageStyle?: TextStyle
  children: ReactNode
}

const CommonWrapper: FC<CommonWrapperProps> = ({ field, error, fieldLabelStyle, fieldDescriptionStyle, fieldErrorMessageStyle, children }) => {
  const labelPlacement = field.labelPlacement || "top_label"
  const descriptionPlacement = field.descriptionPlacement || "below"

  const LabelComponent = (
    <Text style={[{ fontWeight: "bold", marginBottom: 5 }, fieldLabelStyle]}>
      {field.label}
      {field.isRequired && <Text style={{ color: "red" }}> *</Text>}
    </Text>
  )

  const DescriptionComponent = field.description ? <Text style={[{ marginTop: 3 }, fieldDescriptionStyle]}>{field.description}</Text> : null

  return (
    <View style={{ marginBottom: 15 }}>
      {labelPlacement === "top_label" && LabelComponent}
      {descriptionPlacement === "above" && DescriptionComponent}
      {children}
      {descriptionPlacement === "below" && DescriptionComponent}
      {error && <Text style={[{ color: "red", marginTop: 3 }, fieldErrorMessageStyle]}>{error}</Text>}
    </View>
  )
}

export default CommonWrapper
