import React from "react"
import { View, Text } from "react-native"
import Dropdown from "react-native-input-select"
import { FieldComponentProps } from "../../types"
import CommonWrapper from "./CommonWrapper"

const MultiselectField: React.FC<FieldComponentProps> = (props) => {
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
    dropdownMultipleSelectedItemStyle,
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
    multipleSelectionMessage,
  } = props

  if (field.visibility === "hidden" || field.visibility === "administrative") return null

  const options =
    field.choices?.map((choice) => ({
      label: choice.text,
      value: choice.value,
    })) || []

  if (!onValueChange) {
    console.error(`onValueChange is not defined for multiselect field ${field.id}`)
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
        placeholder={field.placeholder || "Select options"}
        options={options}
        selectedValue={value}
        onValueChange={onValueChange}
        primaryColor={primaryColor}
        isSearchable={dropdownIsSearchable}
        isMultiple={true}
        autoCloseOnSelect={dropdownAutoCloseOnSelect}
        labelStyle={{ fontWeight: "bold", marginBottom: 5, ...fieldLabelStyle }}
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
        multipleSelectedItemStyle={dropdownMultipleSelectedItemStyle}
        dropdownErrorStyle={dropdownErrorStyle}
        dropdownErrorTextStyle={fieldErrorMessageStyle || dropdownErrorTextStyle}
        listHeaderComponent={
          <View style={{ paddingHorizontal: 15, marginBottom: 8 }}>
            <Text style={[{ fontWeight: "bold" }, fieldLabelStyle]}>{field.label}</Text>
            {field.description && <Text style={fieldDescriptionStyle}>{field.description}</Text>}
          </View>
        }
        listFooterComponent={
          <View style={{ padding: 10 }}>
            <Text style={fieldDescriptionStyle}>{multipleSelectionMessage}</Text>
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

export default MultiselectField
