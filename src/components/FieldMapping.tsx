import { FC, ReactNode, useState } from "react"
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

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const websiteRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/

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
  number: ({ field, value, onChangeText, error, ...props }) => {
    const min = field.rangeMin !== undefined ? parseFloat(field.rangeMin) : null
    const max = field.rangeMax !== undefined ? parseFloat(field.rangeMax) : null

    const validateNumber = (num: number): number => {
      if (min !== null && num < min) return min
      if (max !== null && num > max) return max
      return num
    }

    return (
      <CommonWrapper field={field} error={error}>
        <TextInput
          style={{ borderWidth: 1, borderColor: error ? "red" : "#ccc", padding: 10, borderRadius: 5 }}
          value={value}
          onChangeText={(text) => {
            // Allow negative numbers
            const isNegative = text.startsWith("-")

            // Remove any non-numeric characters (except decimal point and minus sign)
            let numericValue = text.replace(/[^0-9.-]/g, "")

            // Ensure only one decimal point and handle negative numbers
            const parts = numericValue.split(".")
            let integerPart = parts[0].replace(/^-?0+/, "") // Remove leading zeros
            if (integerPart === "") integerPart = "0"
            let decimalPart = parts.length > 1 ? "." + parts[1].slice(0, 2) : "" // Limit to 2 decimal places

            let formattedValue = (isNegative ? "-" : "") + integerPart + decimalPart

            // Validate against min/max
            const numValue = parseFloat(formattedValue)
            if (!isNaN(numValue)) {
              const validatedValue = validateNumber(numValue)
              formattedValue = validatedValue.toString()
            }

            // Add thousand separators
            formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

            onChangeText(formattedValue)
          }}
          keyboardType="numeric"
          {...props}
        />
      </CommonWrapper>
    )
  },
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
  email: ({ field, value, onChangeText, error, ...props }) => {
    const [isValid, setIsValid] = useState(true)

    const validateEmail = (email: string) => {
      const isValidEmail = emailRegex.test(email)
      setIsValid(isValidEmail)
      return isValidEmail
    }

    return (
      <CommonWrapper field={field} error={error}>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: error ? "red" : isValid ? "#ccc" : "orange",
            padding: 10,
            borderRadius: 5,
          }}
          value={value}
          onChangeText={(text) => {
            onChangeText(text)
            validateEmail(text)
          }}
          onBlur={() => validateEmail(value)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          {...props}
        />
        {!isValid && <Text style={{ color: "orange", fontSize: 12, marginTop: 3 }}>Please enter a valid email address</Text>}
      </CommonWrapper>
    )
  },
  website: ({ field, value, onChangeText, error, ...props }) => {
    const [isValid, setIsValid] = useState(true)

    const validateWebsite = (url: string) => {
      const isValidUrl = websiteRegex.test(url)
      setIsValid(isValidUrl)
      return isValidUrl
    }

    return (
      <CommonWrapper field={field} error={error}>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: error ? "red" : isValid ? "#ccc" : "orange",
            padding: 10,
            borderRadius: 5,
          }}
          value={value}
          onChangeText={(text) => {
            onChangeText(text)
            validateWebsite(text)
          }}
          onBlur={() => validateWebsite(value)}
          keyboardType="url"
          autoCapitalize="none"
          autoCorrect={false}
          {...props}
        />
        {!isValid && <Text style={{ color: "orange", fontSize: 12, marginTop: 3 }}>Please enter a valid website URL</Text>}
      </CommonWrapper>
    )
  },
}

// Create a new field mapping object, allowing custom field components to be added
export const createFieldMapping = (customMapping: FieldMapping = {}): FieldMapping => ({
  ...defaultFieldMapping,
  ...customMapping,
})
