import React from "react"
import { View, Text } from "react-native"
import Dropdown from "react-native-input-select"
import { FieldComponentProps } from "../../types"
import CommonWrapper from "./CommonWrapper"

const SelectField: React.FC<FieldComponentProps> = (props) => {
  const {
    field,
    value,
    onValueChange,
    error,
    primaryColor,
    fieldLabelStyle,
    fieldDescriptionStyle,
    fieldErrorMessageStyle,
    inputPlaceholderStyle,
    inputBorderColor,
    inputContainerStyle,
    // Dropdown props
    dropdownStyle,
    dropdownContainerStyle,
    dropdownIcon,
    dropdownIconStyle,
    dropdownSelectedItemStyle,
    dropdownErrorStyle,
    dropdownErrorTextStyle,
    dropdownIsSearchable,
    dropdownAutoCloseOnSelect,
    dropdownListEmptyComponent,
    dropdownListComponentStyles,
    dropdownListControls,
    dropdownSearchControls,
    dropdownModalControls,
    dropdownCheckboxControls,
  } = props

  if (field.visibility === "hidden" || field.visibility === "administrative") return null

  const options =
    field.choices?.map((choice) => ({
      label: choice.text,
      value: choice.value,
    })) || []

  if (!onValueChange) {
    console.error(`onValueChange is not defined for select field ${field.id}`)
    return null
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
      <Dropdown
        label=""
        placeholder={field.placeholder || "Select an option"}
        options={options}
        selectedValue={value}
        onValueChange={onValueChange}
        primaryColor={primaryColor}
        isSearchable={dropdownIsSearchable}
        autoCloseOnSelect={dropdownAutoCloseOnSelect}
        helperText=""
        placeholderStyle={inputPlaceholderStyle}
        dropdownStyle={{
          borderColor: error ? "red" : inputBorderColor,
          ...inputContainerStyle,
          ...dropdownStyle,
        }}
        dropdownContainerStyle={{ marginTop: 0, marginBottom: 0, ...dropdownContainerStyle }}
        dropdownIcon={dropdownIcon}
        dropdownIconStyle={dropdownIconStyle}
        selectedItemStyle={dropdownSelectedItemStyle}
        dropdownErrorStyle={dropdownErrorStyle}
        dropdownErrorTextStyle={fieldErrorMessageStyle || dropdownErrorTextStyle}
        listHeaderComponent={
          <View style={{ paddingHorizontal: 15, marginBottom: 8 }}>
            <Text style={[{ fontWeight: "bold" }, fieldLabelStyle]}>{field.label}</Text>
            {field.description && <Text style={fieldDescriptionStyle}>{field.description}</Text>}
          </View>
        }
        listEmptyComponent={dropdownListEmptyComponent}
        listComponentStyles={dropdownListComponentStyles}
        listControls={dropdownListControls}
        searchControls={dropdownSearchControls}
        modalControls={dropdownModalControls}
        checkboxControls={dropdownCheckboxControls}
      />
    </CommonWrapper>
  )
}

export default SelectField
