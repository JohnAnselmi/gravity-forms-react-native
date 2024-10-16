import React, { useState } from "react"
import { TouchableOpacity, TextInput } from "react-native"
import DateTimePickerModal from "react-native-modal-datetime-picker"
import { FieldComponentProps } from "../../types"
import CommonWrapper from "./CommonWrapper"
import { format, parse } from "date-fns"

const TimeField: React.FC<FieldComponentProps> = (props) => {
  const {
    field,
    value,
    onChangeText,
    error,
    primaryColor,
    timeFormat = "pp",
    fieldLabelStyle,
    fieldDescriptionStyle,
    fieldErrorMessageStyle,
    inputTextStyle,
    inputPlaceholderStyle,
    inputBorderColor,
    inputContainerStyle,
  } = props

  if (field.visibility === "hidden" || field.visibility === "administrative") return null

  const [isTimePickerVisible, setTimePickerVisibility] = useState(false)

  const showTimePicker = () => setTimePickerVisibility(true)
  const hideTimePicker = () => setTimePickerVisibility(false)

  const handleConfirm = (date: Date) => {
    hideTimePicker()
    const formattedTime = format(date, timeFormat)
    onChangeText!(formattedTime)
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
      <TouchableOpacity onPress={showTimePicker}>
        <TextInput
          style={[
            {
              borderWidth: 1,
              borderColor: error ? "red" : inputBorderColor,
              padding: 10,
              borderRadius: 5,
            },
            inputTextStyle,
            inputContainerStyle,
          ]}
          value={value}
          editable={false}
          placeholder={field.placeholder || "Select time"}
          placeholderTextColor={inputPlaceholderStyle?.color}
        />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideTimePicker}
        date={value ? parse(value, timeFormat, new Date()) : new Date()}
      />
    </CommonWrapper>
  )
}

export default TimeField
