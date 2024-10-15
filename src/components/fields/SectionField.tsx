import React from "react"
import { View, Text, TextStyle } from "react-native"
import { FieldComponentProps } from "../../types"

const SectionField: React.FC<FieldComponentProps> = (props) => {
  const { field, primaryColor, fieldLabelStyle, fieldDescriptionStyle, sectionTitleStyle } = props

  if (field.visibility === "hidden" || field.visibility === "administrative") return null

  const descriptionPlacement = field.descriptionPlacement || "below"

  const DescriptionComponent = field.description ? <Text style={[{ marginTop: 3 }, fieldDescriptionStyle]}>{field.description}</Text> : null

  const defaultSectionTitleStyle: TextStyle = {
    fontWeight: "bold",
    fontSize: 18,
    color: primaryColor,
  }

  const combinedSectionTitleStyle = [defaultSectionTitleStyle, fieldLabelStyle, sectionTitleStyle]

  return (
    <View style={{ marginVertical: 10, borderBottomColor: primaryColor, borderBottomWidth: 1, paddingBottom: 5 }}>
      <Text style={combinedSectionTitleStyle}>{field.label}</Text>
      {descriptionPlacement === "above" && DescriptionComponent}
      {descriptionPlacement === "below" && DescriptionComponent}
    </View>
  )
}

export default SectionField
