import React, { useState } from "react"
import { View, TextInput, TouchableOpacity, Text, Pressable } from "react-native"
import { FieldComponentProps } from "../../types"
import CommonWrapper from "./CommonWrapper"

const ListField: React.FC<FieldComponentProps> = (props) => {
  const {
    field,
    value,
    onValueChange,
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

  const [rows, setRows] = useState<any[]>(Array.isArray(value) ? value : [{}])

  // Update a specific row and column
  const updateRow = (rowIndex: number, columnKey: string, text: string) => {
    const updatedRows = [...rows]
    updatedRows[rowIndex] = { ...updatedRows[rowIndex], [columnKey]: text }
    setRows(updatedRows)

    // Flatten the data into an array
    const flattenedData = updatedRows.flatMap((row) => (field.enableColumns ? field.choices?.map((col) => row[col.value] || "") : row.value || ""))
    onValueChange!(flattenedData)
  }

  // Add a new row
  const addRow = () => {
    if (field.maxRows && rows.length >= field.maxRows) return
    const updatedRows = [...rows, {}]
    setRows(updatedRows)
  }

  // Remove a specific row
  const removeRow = (index: number) => {
    const updatedRows = rows.filter((_, i) => i !== index)
    setRows(updatedRows)

    // Update the flattened data
    const flattenedData = updatedRows.flatMap((row) => (field.enableColumns ? field.choices?.map((col) => row[col.value] || "") : row.value || ""))
    onValueChange!(flattenedData)
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
      <View>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={{ marginBottom: 15 }}>
            {field.enableColumns ? (
              field.choices?.map((column, columnIndex) => (
                <TextInput
                  key={columnIndex}
                  style={[
                    {
                      borderWidth: 1,
                      borderColor: error ? "red" : inputBorderColor,
                      padding: 10,
                      borderRadius: 5,
                      marginBottom: 4,
                    },
                    inputTextStyle,
                    inputContainerStyle,
                  ]}
                  value={row[column.value] || ""}
                  onChangeText={(text) => updateRow(rowIndex, column.value, text)}
                  placeholder={column.text}
                  placeholderTextColor={inputPlaceholderStyle?.color}
                />
              ))
            ) : (
              <TextInput
                style={[
                  {
                    borderWidth: 1,
                    borderColor: error ? "red" : inputBorderColor,
                    padding: 10,
                    borderRadius: 5,
                    marginBottom: 4,
                  },
                  inputTextStyle,
                  inputContainerStyle,
                ]}
                value={row.value || ""}
                onChangeText={(text) => updateRow(rowIndex, "value", text)}
                placeholder={field.label}
                placeholderTextColor={inputPlaceholderStyle?.color}
              />
            )}
            <View style={{ flexDirection: "row", justifyContent: "flex-start", marginBottom: 1 }}>
              <TouchableOpacity onPress={() => removeRow(rowIndex)}>
                <Text style={{ color: "red" }}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      {(!field.maxRows || rows.length < field.maxRows) && (
        <Pressable
          onPress={addRow}
          style={{
            marginTop: -25,
            marginBottom: 2,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 5,
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold", color: primaryColor }}>+</Text>
          <Text style={{ fontSize: 16, color: primaryColor }}>Add Row</Text>
        </Pressable>
      )}
    </CommonWrapper>
  )
}

export default ListField
