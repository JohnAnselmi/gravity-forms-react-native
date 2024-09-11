import { FC, ReactNode } from "react"
import { TextInput, View, Text, Switch, TouchableOpacity } from "react-native"
import { Picker } from "@react-native-picker/picker"
import { FieldMapping, GravityFormField, GravityFormFieldInput } from "../types"

//TODO: Missing Fields:
/// Hidden
/// HTML
/// Section
/// Page
/// Date
/// Time
/// File Upload
/// CAPTCHA
/// List
/// MultiSelect
/// Consent
/// Signature (Add-On)

// CommonWrapper to standardize the layout for all fields
const CommonWrapper: FC<{ field: GravityFormField; error?: string; children: ReactNode }> = ({ field, error, children }) => (
  <View style={{ marginBottom: 15 }}>
    <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
      {field.label}
      {field.isRequired ? " *" : ""}
    </Text>
    {children}
    {field.description && <Text style={{ fontSize: 12, color: "gray", marginTop: 3 }}>{field.description}</Text>}
    {error && <Text style={{ color: "red", fontSize: 12, marginTop: 3 }}>{error}</Text>}
  </View>
)

// Render sub-input for multi-input fields (like name, address, etc.)
const renderSubInput = (input: GravityFormFieldInput, value: any, onChangeText: (text: string) => void, props: any) => {
  if (input.isHidden) return null
  return (
    <TextInput
      key={input.id}
      style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginBottom: 5 }}
      value={value[input.id] || ""}
      onChangeText={(text) => onChangeText({ ...value, [input.id]: text })}
      placeholder={input.label}
      {...props}
    />
  )
}

export const defaultFieldMapping: FieldMapping = {
  text: ({ field, value, onChangeText, error, ...props }) => (
    <CommonWrapper field={field} error={error}>
      <TextInput
        style={{ borderWidth: 1, borderColor: error ? "red" : "#ccc", padding: 10, borderRadius: 5 }}
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
    </CommonWrapper>
  ),
  number: ({ field, value, onChangeText, error, ...props }) => (
    <CommonWrapper field={field} error={error}>
      <TextInput
        style={{ borderWidth: 1, borderColor: error ? "red" : "#ccc", padding: 10, borderRadius: 5 }}
        value={value}
        onChangeText={onChangeText}
        keyboardType="numeric"
        {...props}
      />
    </CommonWrapper>
  ),
  textarea: ({ field, value, onChangeText, error, ...props }) => (
    <CommonWrapper field={field} error={error}>
      <TextInput
        style={{ borderWidth: 1, borderColor: error ? "red" : "#ccc", padding: 10, borderRadius: 5, height: 100 }}
        multiline
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
    </CommonWrapper>
  ),
  select: ({ field, value, onValueChange, error, ...props }) => (
    <CommonWrapper field={field} error={error}>
      <Picker selectedValue={value} onValueChange={onValueChange} style={{ borderWidth: 1, borderColor: error ? "red" : "#ccc", borderRadius: 5 }} {...props}>
        {field.choices?.map((choice: any) => (
          <Picker.Item label={choice.text} value={choice.value} key={choice.value} />
        ))}
      </Picker>
    </CommonWrapper>
  ),
  checkbox: ({ field, value, onValueChange, error, ...props }) => (
    <CommonWrapper field={field} error={error}>
      {field.choices?.map((choice: any) => (
        <View key={choice.value} style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }}>
          <Switch
            value={Array.isArray(value) ? value.includes(choice.value) : value === choice.value}
            onValueChange={(isChecked) => {
              if (field.choices && field.choices.length === 1) {
                // Single checkbox
                onValueChange(isChecked ? choice.value : "")
              } else {
                // Multi-checkbox
                const newValue = Array.isArray(value) ? value : []
                if (isChecked) {
                  onValueChange([...newValue, choice.value])
                } else {
                  onValueChange(newValue.filter((v: string) => v !== choice.value))
                }
              }
            }}
            {...props}
          />
          <Text style={{ marginLeft: 10 }}>{choice.text}</Text>
        </View>
      ))}
    </CommonWrapper>
  ),
  radio: ({ field, value, onValueChange, error, ...props }) => (
    <CommonWrapper field={field} error={error}>
      {field.choices?.map((choice: any) => (
        <TouchableOpacity
          key={choice.value}
          onPress={() => onValueChange(choice.value)}
          style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }}
        >
          <View
            style={{
              height: 20,
              width: 20,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: value === choice.value ? "blue" : "#ccc",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {value === choice.value && <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: "blue" }} />}
          </View>
          <Text style={{ marginLeft: 10 }}>{choice.text}</Text>
        </TouchableOpacity>
      ))}
    </CommonWrapper>
  ),
  name: ({ field, value, onChangeText, error, ...props }) => (
    <CommonWrapper field={field} error={error}>
      {field.inputs?.map((input: any) => renderSubInput(input, value, onChangeText, props))}
    </CommonWrapper>
  ),
  address: ({ field, value, onChangeText, error, ...props }) => (
    <CommonWrapper field={field} error={error}>
      {field.inputs?.map((input: any) => renderSubInput(input, value, onChangeText, props))}
    </CommonWrapper>
  ),
  phone: ({ field, value, onChangeText, error, ...props }) => (
    <CommonWrapper field={field} error={error}>
      <TextInput
        style={{ borderWidth: 1, borderColor: error ? "red" : "#ccc", padding: 10, borderRadius: 5 }}
        value={value}
        onChangeText={onChangeText}
        keyboardType="phone-pad"
        {...props}
      />
    </CommonWrapper>
  ),
  email: ({ field, value, onChangeText, error, ...props }) => (
    <CommonWrapper field={field} error={error}>
      <TextInput
        style={{ borderWidth: 1, borderColor: error ? "red" : "#ccc", padding: 10, borderRadius: 5 }}
        value={value}
        onChangeText={onChangeText}
        keyboardType="email-address"
        {...props}
      />
    </CommonWrapper>
  ),
  website: ({ field, value, onChangeText, error, ...props }) => (
    <CommonWrapper field={field} error={error}>
      <TextInput
        style={{ borderWidth: 1, borderColor: error ? "red" : "#ccc", padding: 10, borderRadius: 5 }}
        value={value}
        onChangeText={onChangeText}
        keyboardType="url"
        {...props}
      />
    </CommonWrapper>
  ),
}

// Create a new field mapping object, allowing custom field components to be added
export const createFieldMapping = (customMapping: FieldMapping = {}): FieldMapping => ({
  ...defaultFieldMapping,
  ...customMapping,
})
