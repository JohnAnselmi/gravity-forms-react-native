import React from "react"
import { FieldComponentProps } from "../../types"
import CommonWrapper from "./CommonWrapper"
import { renderSubInput } from "./utils"

const NameField: React.FC<FieldComponentProps> = (props) => {
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
      {field.inputs?.map((input) =>
        renderSubInput(input, value, onChangeText!, inputTextStyle!, inputPlaceholderStyle!, inputBorderColor!, inputContainerStyle!)
      )}
    </CommonWrapper>
  )
}

export default NameField
