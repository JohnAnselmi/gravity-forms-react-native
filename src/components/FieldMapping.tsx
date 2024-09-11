import { FC, ReactNode, useRef, useState } from "react"
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

//TODO: Switch to react-native-dropdown-picker for select. https://github.com/hossein-zare/react-native-dropdown-picker

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const websiteRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/

// CommonWrapper to standardize the layout for all fields
const CommonWrapper: FC<{ field: GravityFormField; error?: string; textColor: string; primaryColor: string; buttonTextColor: string; children: ReactNode }> = ({
  field,
  error,
  textColor,
  children,
}) => (
  <View style={{ marginBottom: 15 }}>
    <Text style={{ fontWeight: "bold", marginBottom: 5, color: textColor }}>
      {field.label}
      <Text style={{ color: "red" }}>{field.isRequired ? " *" : ""}</Text>
    </Text>
    {children}
    {field.description && <Text style={{ color: textColor, marginTop: 3 }}>{field.description}</Text>}
    {error && <Text style={{ color: "red", marginTop: 3 }}>{error}</Text>}
  </View>
)

// Render sub-input for multi-input fields (like name, address, etc.)
const renderSubInput = (input: GravityFormFieldInput, value: any, onChangeText: (text: string) => void, props: any, textColor: string) => {
  if (input.isHidden) return null
  return (
    <TextInput
      key={input.id}
      style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginBottom: 5, color: textColor }}
      value={value[input.id] || ""}
      onChangeText={(text) => onChangeText({ ...value, [input.id]: text })}
      placeholder={input.label}
      {...props}
    />
  )
}

export const defaultFieldMapping: FieldMapping = {
  text: ({ field, value, onChangeText, error, textColor, primaryColor, buttonTextColor, ...props }) => (
    <CommonWrapper field={field} error={error} textColor={textColor} primaryColor={primaryColor} buttonTextColor={buttonTextColor}>
      <TextInput
        style={{ borderWidth: 1, borderColor: error ? "red" : "#ccc", padding: 10, borderRadius: 5, color: textColor }}
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
    </CommonWrapper>
  ),
  number: ({ field, value, onChangeText, error, textColor, primaryColor, buttonTextColor, ...props }) => {
    const [localValue, setLocalValue] = useState(value)
    const [isValid, setIsValid] = useState(true)
    const inputRef = useRef<TextInput>(null)

    const min = field.rangeMin !== undefined ? parseFloat(field.rangeMin) : null
    const max = field.rangeMax !== undefined ? parseFloat(field.rangeMax) : null

    const validateNumber = (text: string) => {
      const num = parseFloat(text)
      if (isNaN(num)) {
        setIsValid(false)
        return false
      }
      if ((min !== null && num < min) || (max !== null && num > max)) {
        setIsValid(false)
        return false
      }
      setIsValid(true)
      return true
    }

    return (
      <CommonWrapper field={field} error={error} textColor={textColor} primaryColor={primaryColor} buttonTextColor={buttonTextColor}>
        <TextInput
          ref={inputRef}
          style={{
            borderWidth: 1,
            borderColor: error ? "red" : isValid ? "#ccc" : "orange",
            padding: 10,
            borderRadius: 5,
            color: textColor,
          }}
          value={localValue}
          onChangeText={(text) => {
            // Allow only numbers, one decimal point, and minus sign at the start
            const sanitizedText = text
              .replace(/[^0-9.-]/g, "")
              .replace(/(?!^)-/g, "")
              .replace(/(\..*)\./g, "$1")
            setLocalValue(sanitizedText)

            if (validateNumber(sanitizedText)) {
              onChangeText(sanitizedText)
            }
          }}
          onBlur={() => {
            const isValidNumber = validateNumber(localValue)
            if (isValidNumber) {
              const num = parseFloat(localValue)
              let finalValue = num
              if (min !== null && num < min) finalValue = min
              if (max !== null && num > max) finalValue = max
              const formattedValue = finalValue.toString()
              setLocalValue(formattedValue)
              onChangeText(formattedValue)
            }
          }}
          keyboardType="numeric"
          {...props}
        />
        {!isValid && (
          <Text style={{ color: "orange", fontSize: 12, marginTop: 3 }}>
            {min !== null && max !== null
              ? `Please enter a number between ${min} and ${max}`
              : min !== null
              ? `Please enter a number greater than or equal to ${min}`
              : max !== null
              ? `Please enter a number less than or equal to ${max}`
              : "Please enter a valid number"}
          </Text>
        )}
      </CommonWrapper>
    )
  },
  textarea: ({ field, value, onChangeText, error, textColor, primaryColor, buttonTextColor, ...props }) => (
    <CommonWrapper field={field} error={error} textColor={textColor} primaryColor={primaryColor} buttonTextColor={buttonTextColor}>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: error ? "red" : "#ccc",
          padding: 10,
          borderRadius: 5,
          height: 100,
          color: textColor,
          textAlignVertical: "top",
          paddingTop: 5,
        }}
        multiline
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
    </CommonWrapper>
  ),
  select: ({ field, value, onValueChange, error, textColor, primaryColor, buttonTextColor, ...props }) => (
    <CommonWrapper field={field} error={error} textColor={textColor} primaryColor={primaryColor} buttonTextColor={buttonTextColor}>
      <Picker
        selectedValue={value}
        onValueChange={onValueChange}
        style={{ borderWidth: 1, borderColor: error ? "red" : "#ccc", borderRadius: 5, color: textColor }}
        dropdownIconColor={textColor}
        selectionColor={primaryColor}
        prompt={field.label}
        {...props}
      >
        {field.choices?.map((choice: any) => (
          <Picker.Item label={choice.text} value={choice.value} key={choice.value} color={textColor} />
        ))}
      </Picker>
    </CommonWrapper>
  ),
  checkbox: ({ field, value, onValueChange, error, textColor, primaryColor, buttonTextColor, ...props }) => (
    <CommonWrapper field={field} error={error} textColor={textColor} primaryColor={primaryColor} buttonTextColor={buttonTextColor}>
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
            thumbColor={primaryColor}
            trackColor={primaryColor}
            color={textColor}
            selectedColor={primaryColor}
            {...props}
          />
          <Text style={{ marginLeft: 10 }}>{choice.text}</Text>
        </View>
      ))}
    </CommonWrapper>
  ),
  radio: ({ field, value, onValueChange, error, textColor, primaryColor, buttonTextColor, ...props }) => (
    <CommonWrapper field={field} error={error} textColor={textColor} primaryColor={primaryColor} buttonTextColor={buttonTextColor}>
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
            {value === choice.value && <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: primaryColor }} />}
          </View>
          <Text style={{ marginLeft: 10, color: textColor }}>{choice.text}</Text>
        </TouchableOpacity>
      ))}
    </CommonWrapper>
  ),
  name: ({ field, value, onChangeText, error, textColor, primaryColor, buttonTextColor, ...props }) => (
    <CommonWrapper field={field} error={error} textColor={textColor} primaryColor={primaryColor} buttonTextColor={buttonTextColor}>
      {field.inputs?.map((input: any) => renderSubInput(input, value, onChangeText, props, textColor))}
    </CommonWrapper>
  ),
  address: ({ field, value, onChangeText, error, textColor, primaryColor, buttonTextColor, ...props }) => (
    <CommonWrapper field={field} error={error} textColor={textColor} primaryColor={primaryColor} buttonTextColor={buttonTextColor}>
      {field.inputs?.map((input: any) => renderSubInput(input, value, onChangeText, props, textColor))}
    </CommonWrapper>
  ),
  phone: ({ field, value, onChangeText, error, textColor, primaryColor, buttonTextColor, ...props }) => (
    <CommonWrapper field={field} error={error} textColor={textColor} primaryColor={primaryColor} buttonTextColor={buttonTextColor}>
      <TextInput
        style={{ borderWidth: 1, borderColor: error ? "red" : "#ccc", padding: 10, borderRadius: 5, color: textColor }}
        value={value}
        onChangeText={onChangeText}
        keyboardType="phone-pad"
        {...props}
      />
    </CommonWrapper>
  ),
  email: ({ field, value, onChangeText, error, textColor, primaryColor, buttonTextColor, ...props }) => {
    const [isValid, setIsValid] = useState(true)

    const validateEmail = (email: string) => {
      const isValidEmail = emailRegex.test(email)
      setIsValid(isValidEmail)
      return isValidEmail
    }

    return (
      <CommonWrapper field={field} error={error} textColor={textColor} primaryColor={primaryColor} buttonTextColor={buttonTextColor}>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: error ? "red" : isValid ? "#ccc" : "orange",
            padding: 10,
            borderRadius: 5,
            color: textColor,
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
  website: ({ field, value, onChangeText, error, textColor, primaryColor, buttonTextColor, ...props }) => {
    const [isValid, setIsValid] = useState(true)

    const validateWebsite = (url: string) => {
      const isValidUrl = websiteRegex.test(url)
      setIsValid(isValidUrl)
      return isValidUrl
    }

    return (
      <CommonWrapper field={field} error={error} textColor={textColor} primaryColor={primaryColor} buttonTextColor={buttonTextColor}>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: error ? "red" : isValid ? "#ccc" : "orange",
            padding: 10,
            borderRadius: 5,
            color: textColor,
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
