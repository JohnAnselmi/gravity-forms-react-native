import React from "react"
import { TextInput, View, Text, Switch, ScrollView } from "react-native"
import { Picker } from "@react-native-picker/picker"
import { FieldMapping, GravityFormField, GravityFormFieldInput } from "../types"

const CommonWrapper: React.FC<{ field: GravityFormField; error?: string; children: React.ReactNode }> = ({ field, error, children }) => (
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

const renderInput = (input: GravityFormFieldInput, value: any, onChangeText: (text: string) => void, props: any) => {
  if (input.isHidden) {
    return null
  }
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
        {field.choices?.map((choice) => (
          <Picker.Item label={choice.text} value={choice.value} key={choice.value} />
        ))}
      </Picker>
    </CommonWrapper>
  ),
  checkbox: ({ field, value, onValueChange, error, ...props }) => (
    <CommonWrapper field={field} error={error}>
      <Switch value={value} onValueChange={onValueChange} {...props} />
    </CommonWrapper>
  ),
  radio: ({ field, value, onValueChange, error, ...props }) => (
    <CommonWrapper field={field} error={error}>
      <ScrollView>
        {field.choices?.map((choice) => (
          <View key={choice.value} style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }}>
            <Switch value={value === choice.value} onValueChange={(isChecked) => isChecked && onValueChange(choice.value)} />
            <Text style={{ marginLeft: 10 }}>{choice.text}</Text>
          </View>
        ))}
      </ScrollView>
    </CommonWrapper>
  ),
  name: ({ field, value, onChangeText, error, ...props }) => (
    <CommonWrapper field={field} error={error}>
      {field.inputs?.map((input) => renderInput(input, value, onChangeText, props))}
    </CommonWrapper>
  ),
  address: ({ field, value, onChangeText, error, ...props }) => (
    <CommonWrapper field={field} error={error}>
      {field.inputs?.map((input) => renderInput(input, value, onChangeText, props))}
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
  product: ({ field, value, onChangeText, error, ...props }) => (
    <CommonWrapper field={field} error={error}>
      {field.inputType === "radio" ? (
        <ScrollView>
          {field.choices?.map((choice) => (
            <View key={choice.value} style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }}>
              <Switch value={value === choice.value} onValueChange={(isChecked) => isChecked && onChangeText(choice.value)} />
              <Text style={{ marginLeft: 10 }}>{choice.text}</Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <TextInput
          style={{ borderWidth: 1, borderColor: error ? "red" : "#ccc", padding: 10, borderRadius: 5 }}
          value={value}
          onChangeText={onChangeText}
          keyboardType="numeric"
          {...props}
        />
      )}
    </CommonWrapper>
  ),
}

export const createFieldMapping = (customMapping: FieldMapping = {}): FieldMapping => ({
  ...defaultFieldMapping,
  ...customMapping,
})
