import React, { useState } from "react"
import { TouchableOpacity, TextInput } from "react-native"
import DateTimePickerModal from "react-native-modal-datetime-picker"
import { FieldComponentProps } from "../../types"
import CommonWrapper from "./CommonWrapper"
import { format, parse } from "date-fns"

const DateField: React.FC<FieldComponentProps> = (props) => {
  const {
    field,
    value,
    onChangeText,
    error,
    primaryColor,
    dateFormat = "PPP",
    fieldLabelStyle,
    fieldDescriptionStyle,
    fieldErrorMessageStyle,
    inputTextStyle,
    inputPlaceholderStyle,
    inputBorderColor,
    inputContainerStyle,
  } = props

  if (field.visibility === "hidden" || field.visibility === "administrative") return null

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)

  const showDatePicker = () => setDatePickerVisibility(true)
  const hideDatePicker = () => setDatePickerVisibility(false)

  const handleConfirm = (date: Date) => {
    const formattedDate = format(date, dateFormat)
    onChangeText!(formattedDate)
    hideDatePicker()
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
      <TouchableOpacity onPress={showDatePicker}>
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
          placeholder={field.placeholder || "Select date"}
          placeholderTextColor={inputPlaceholderStyle?.color}
        />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={value ? parse(value, dateFormat, new Date()) : new Date()}
      />
    </CommonWrapper>
  )
}

export default DateField
