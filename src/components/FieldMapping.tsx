import React, { FC, ReactNode, useRef, useState } from "react"
import { TextInput, View, Text, Switch, TouchableOpacity, TextStyle, ViewStyle } from "react-native"
import { Picker } from "@react-native-picker/picker"
import { FieldMapping, GravityFormField, GravityFormFieldInput, FieldComponentProps } from "../types"

//TODO: Missing Fields:
/// HTML
/// Page
/// Date
/// Time
/// File Upload
/// CAPTCHA
/// List
/// MultiSelect
/// Signature (Add-On)
//TODO: Switch to react-native-dropdown-picker for select. https://github.com/hossein-zare/react-native-dropdown-picker
//TODO: Allow for custom styles for inputs (border color, border width, etc.)
//TODO: Fix readme to include all recent changes.

// Regular expressions for validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const websiteRegex = /^(https?:\/\/)?([\w.-]+)+(:\d+)?(\/([\w/_.]*)?)?$/

// CommonWrapper to standardize the layout for all fields
const CommonWrapper: FC<{
  field: GravityFormField
  error?: string
  primaryColor: string
  fieldLabelStyle?: TextStyle
  fieldDescriptionStyle?: TextStyle
  fieldErrorMessageStyle?: TextStyle
  fieldValidationMessageStyle?: TextStyle
  children: ReactNode
}> = ({ field, error, fieldLabelStyle, fieldDescriptionStyle, fieldErrorMessageStyle, children }) => {
  // Determine label and description placement
  const labelPlacement = field.labelPlacement || "top_label"
  const descriptionPlacement = field.descriptionPlacement || "below"

  const LabelComponent = (
    <Text style={[{ fontWeight: "bold", marginBottom: 5 }, fieldLabelStyle]}>
      {field.label}
      {field.isRequired && <Text style={{ color: "red" }}> *</Text>}
    </Text>
  )

  const DescriptionComponent = field.description ? <Text style={[{ marginTop: 3 }, fieldDescriptionStyle]}>{field.description}</Text> : null

  return (
    <View style={{ marginBottom: 15 }}>
      {labelPlacement === "top_label" && LabelComponent}
      {descriptionPlacement === "above" && DescriptionComponent}
      {children}
      {descriptionPlacement === "below" && DescriptionComponent}
      {error && <Text style={[{ color: "red", marginTop: 3 }, fieldErrorMessageStyle]}>{error}</Text>}
    </View>
  )
}

// Render sub-input for multi-input fields (like name, address, etc.)
const renderSubInput = (input: GravityFormFieldInput, value: any, onChangeText: (text: any) => void, inputStyle: TextStyle) => {
  if (input.isHidden) return null
  return (
    <TextInput
      key={input.id}
      style={[{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginBottom: 5 }, inputStyle]}
      value={value[input.id] || ""}
      onChangeText={(text) => onChangeText({ ...value, [input.id]: text })}
      placeholder={input.label}
    />
  )
}

export const defaultFieldMapping: FieldMapping = {
  // Address Field
  address: (props: FieldComponentProps) => {
    const { field, value, onChangeText, error, primaryColor, fieldLabelStyle, fieldDescriptionStyle, fieldErrorMessageStyle, inputStyle } = props
    // Handle field visibility
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
        {field.inputs?.map((input) => renderSubInput(input, value, onChangeText!, inputStyle!))}
      </CommonWrapper>
    )
  },

  // Checkbox Field
  checkbox: (props: FieldComponentProps) => {
    const { field, value, onValueChange, error, primaryColor, fieldLabelStyle, fieldDescriptionStyle, fieldErrorMessageStyle } = props
    // Handle field visibility
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
        {field.choices?.map((choice) => (
          <View key={choice.value} style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }}>
            <Switch
              value={Array.isArray(value) ? value.includes(choice.value) : value === choice.value}
              onValueChange={(isChecked) => {
                if (field.choices && field.choices.length === 1) {
                  // Single checkbox
                  onValueChange!(isChecked ? choice.value : "")
                } else {
                  // Multi-checkbox
                  const newValue = Array.isArray(value) ? value : []
                  if (isChecked) {
                    onValueChange!([...newValue, choice.value])
                  } else {
                    onValueChange!(newValue.filter((v: string) => v !== choice.value))
                  }
                }
              }}
              thumbColor={primaryColor}
              trackColor={{ false: "#ccc", true: primaryColor }}
            />
            <Text style={{ marginLeft: 10 }}>{choice.text}</Text>
          </View>
        ))}
      </CommonWrapper>
    )
  },

  // Consent Field
  consent: (props: FieldComponentProps) => {
    const { field, value, onValueChange, error, primaryColor, fieldLabelStyle, fieldDescriptionStyle, fieldErrorMessageStyle } = props
    // Handle field visibility
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
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Switch value={value} onValueChange={onValueChange!} thumbColor={primaryColor} trackColor={{ false: "#ccc", true: primaryColor }} />
          <Text style={{ marginLeft: 10 }}>{field.checkboxLabel}</Text>
        </View>
      </CommonWrapper>
    )
  },

  // Email Field
  email: (props: FieldComponentProps) => {
    const {
      field,
      value,
      onChangeText,
      error,
      primaryColor,
      fieldLabelStyle,
      fieldDescriptionStyle,
      fieldErrorMessageStyle,
      fieldValidationMessageStyle,
      inputStyle,
    } = props

    // Handle field visibility
    if (field.visibility === "hidden" || field.visibility === "administrative") return null

    const [isValid, setIsValid] = useState(true)

    const validateEmail = (email: string) => {
      const isValidEmail = emailRegex.test(email)
      setIsValid(isValidEmail)
      return isValidEmail
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
        <TextInput
          style={[
            {
              borderWidth: 1,
              borderColor: error ? "red" : isValid ? "#ccc" : "orange",
              padding: 10,
              borderRadius: 5,
            },
            inputStyle,
          ]}
          value={value}
          onChangeText={(text) => {
            onChangeText!(text)
            validateEmail(text)
          }}
          onBlur={() => validateEmail(value)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {!isValid && <Text style={[{ color: "orange", fontSize: 12, marginTop: 3 }, fieldValidationMessageStyle]}>Please enter a valid email address</Text>}
      </CommonWrapper>
    )
  },

  // Name Field
  name: (props: FieldComponentProps) => {
    const { field, value, onChangeText, error, primaryColor, fieldLabelStyle, fieldDescriptionStyle, fieldErrorMessageStyle, inputStyle } = props
    // Handle field visibility
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
        {field.inputs?.map((input) => renderSubInput(input, value, onChangeText!, inputStyle!))}
      </CommonWrapper>
    )
  },

  // Number Field
  number: (props: FieldComponentProps) => {
    const {
      field,
      value,
      onChangeText,
      error,
      primaryColor,
      fieldLabelStyle,
      fieldDescriptionStyle,
      fieldErrorMessageStyle,
      fieldValidationMessageStyle,
      inputStyle,
    } = props

    // Handle field visibility
    if (field.visibility === "hidden" || field.visibility === "administrative") return null

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
      <CommonWrapper
        field={field}
        error={error}
        primaryColor={primaryColor!}
        fieldLabelStyle={fieldLabelStyle}
        fieldDescriptionStyle={fieldDescriptionStyle}
        fieldErrorMessageStyle={fieldErrorMessageStyle}
      >
        <TextInput
          ref={inputRef}
          style={[
            {
              borderWidth: 1,
              borderColor: error ? "red" : isValid ? "#ccc" : "orange",
              padding: 10,
              borderRadius: 5,
            },
            inputStyle,
          ]}
          value={localValue}
          onChangeText={(text) => {
            // Allow only numbers, one decimal point, and minus sign at the start
            const sanitizedText = text
              .replace(/[^0-9.-]/g, "")
              .replace(/(?!^)-/g, "")
              .replace(/(\..*)\./g, "$1")
            setLocalValue(sanitizedText)

            if (validateNumber(sanitizedText)) {
              onChangeText!(sanitizedText)
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
              onChangeText!(formattedValue)
            }
          }}
          keyboardType="numeric"
        />
        {!isValid && (
          <Text style={[{ color: "orange", fontSize: 12, marginTop: 3 }, fieldValidationMessageStyle]}>
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

  // Phone Field
  phone: (props: FieldComponentProps) => {
    const { field, value, onChangeText, error, primaryColor, fieldLabelStyle, fieldDescriptionStyle, fieldErrorMessageStyle, inputStyle } = props
    // Handle field visibility
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
        <TextInput
          style={[
            {
              borderWidth: 1,
              borderColor: error ? "red" : "#ccc",
              padding: 10,
              borderRadius: 5,
            },
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText!}
          keyboardType="phone-pad"
        />
      </CommonWrapper>
    )
  },

  // Radio Field
  radio: (props: FieldComponentProps) => {
    const { field, value, onValueChange, error, primaryColor, fieldLabelStyle, fieldDescriptionStyle, fieldErrorMessageStyle } = props
    // Handle field visibility
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
        {field.choices?.map((choice) => (
          <TouchableOpacity
            key={choice.value}
            onPress={() => onValueChange!(choice.value)}
            style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }}
          >
            <View
              style={{
                height: 20,
                width: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: value === choice.value ? primaryColor : "#ccc",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {value === choice.value && <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: primaryColor }} />}
            </View>
            <Text style={{ marginLeft: 10 }}>{choice.text}</Text>
          </TouchableOpacity>
        ))}
      </CommonWrapper>
    )
  },

  // Section Field
  section: (props: FieldComponentProps) => {
    const { field, primaryColor, fieldLabelStyle, fieldDescriptionStyle, sectionTitleStyle } = props
    // Handle field visibility
    if (field.visibility === "hidden" || field.visibility === "administrative") return null

    const descriptionPlacement = field.descriptionPlacement || "below"

    const DescriptionComponent = field.description ? <Text style={[{ marginTop: 3 }, fieldDescriptionStyle]}>{field.description}</Text> : null

    return (
      <View style={{ marginVertical: 10, borderBottomColor: primaryColor, borderBottomWidth: 1, paddingBottom: 5 }}>
        <Text style={[{ fontSize: 18, fontWeight: "bold" }, fieldLabelStyle, sectionTitleStyle]}>{field.label}</Text>
        {descriptionPlacement === "above" && DescriptionComponent}
        {descriptionPlacement === "below" && DescriptionComponent}
      </View>
    )
  },

  // Select Field
  select: (props: FieldComponentProps) => {
    const { field, value, onValueChange, error, primaryColor, fieldLabelStyle, fieldDescriptionStyle, fieldErrorMessageStyle } = props
    // Handle field visibility
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
        <View
          style={{
            borderWidth: 1,
            borderColor: error ? "red" : "#ccc",
            borderRadius: 5,
          }}
        >
          <Picker selectedValue={value} onValueChange={onValueChange!} style={{ color: primaryColor }}>
            {field.choices?.map((choice) => (
              <Picker.Item label={choice.text} value={choice.value} key={choice.value} />
            ))}
          </Picker>
        </View>
      </CommonWrapper>
    )
  },

  // Text Field
  text: (props: FieldComponentProps) => {
    const { field, value, onChangeText, error, primaryColor, fieldLabelStyle, fieldDescriptionStyle, fieldErrorMessageStyle, inputStyle } = props
    // Handle field visibility
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
        <TextInput
          style={[
            {
              borderWidth: 1,
              borderColor: error ? "red" : "#ccc",
              padding: 10,
              borderRadius: 5,
            },
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText!}
        />
      </CommonWrapper>
    )
  },

  // Textarea Field
  textarea: (props: FieldComponentProps) => {
    const { field, value, onChangeText, error, primaryColor, fieldLabelStyle, fieldDescriptionStyle, fieldErrorMessageStyle, inputStyle } = props
    // Handle field visibility
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
        <TextInput
          style={[
            {
              borderWidth: 1,
              borderColor: error ? "red" : "#ccc",
              padding: 10,
              borderRadius: 5,
              height: 100,
              textAlignVertical: "top",
              paddingTop: 5,
            },
            inputStyle,
          ]}
          multiline
          value={value}
          onChangeText={onChangeText!}
        />
      </CommonWrapper>
    )
  },

  // Website Field
  website: (props: FieldComponentProps) => {
    const {
      field,
      value,
      onChangeText,
      error,
      primaryColor,
      fieldLabelStyle,
      fieldDescriptionStyle,
      fieldErrorMessageStyle,
      fieldValidationMessageStyle,
      inputStyle,
    } = props

    // Handle field visibility
    if (field.visibility === "hidden" || field.visibility === "administrative") return null

    const [isValid, setIsValid] = useState(true)

    const validateWebsite = (url: string) => {
      const isValidUrl = websiteRegex.test(url)
      setIsValid(isValidUrl)
      return isValidUrl
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
        <TextInput
          style={[
            {
              borderWidth: 1,
              borderColor: error ? "red" : isValid ? "#ccc" : "orange",
              padding: 10,
              borderRadius: 5,
            },
            inputStyle,
          ]}
          value={value}
          onChangeText={(text) => {
            onChangeText!(text)
            validateWebsite(text)
          }}
          onBlur={() => validateWebsite(value)}
          keyboardType="url"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {!isValid && <Text style={[{ color: "orange", fontSize: 12, marginTop: 3 }, fieldValidationMessageStyle]}>Please enter a valid website URL</Text>}
      </CommonWrapper>
    )
  },

  // Hidden Field (return null)
  hidden: () => null,
}

// Create a new field mapping object, allowing custom field components to be added
export const createFieldMapping = (customMapping: FieldMapping = {}): FieldMapping => ({
  ...defaultFieldMapping,
  ...customMapping,
})
