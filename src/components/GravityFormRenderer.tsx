import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView } from "react-native"
import { createApiClient } from "../utils/api"
import { createFieldMapping, defaultFieldMapping } from "./FieldMapping"
import { GravityFormProps, GravityFormObject, GravityFormField, GravityFormFieldType, UserFriendlySubmissionField, CustomFieldHandlers } from "../types"
import { format, parse } from "date-fns"

const GravityForm: React.FC<GravityFormProps> = ({
  formId,
  customFieldMapping = {},
  onSubmit,
  onValidationError,
  containerStyle,
  primaryColor = "#0000ff",
  showFormTitle = false,
  formTitleStyle,
  showFormDescription = false,
  formDescriptionStyle,
  formErrorStyle,
  confirmationMessageStyle,
  fieldLabelStyle,
  fieldDescriptionStyle,
  fieldErrorMessageStyle,
  fieldValidationMessageStyle,
  inputTextStyle,
  inputPlaceholderStyle,
  inputBorderColor = "#ccc",
  inputContainerStyle,
  sectionTitleStyle,
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
  // Other props
  submitButtonContainerStyle,
  submitButtonTextStyle,
  loadingTextStyle,
  loadingSpinnerStyle,
  loadingSpinnerColor,
  loadingSpinnerSize = "small",
  loadingComponent,
  multipleSelectionMessage = "You can select multiple options",
  dateFormat = "PPP",
  timeFormat = "pp",
  showConfirmationScreen = true,
  customConfirmationAction,
  showSubmittedAnswers = true,
  customSubmittedDataTitle,
  submittedDataQuestionStyle,
  submittedDataAnswerStyle,
  customConfirmationComponent,
  customSubmissionOverlayComponent,
  customFieldHandlers = {},
}) => {
  const [form, setForm] = useState<GravityFormObject | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null)
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [userFriendlyData, setUserFriendlyData] = useState<UserFriendlySubmissionField[]>([])

  const apiClient = createApiClient()
  const fieldMapping = useMemo(() => createFieldMapping(customFieldMapping), [customFieldMapping])

  useEffect(() => {
    const loadForm = async () => {
      try {
        const loadedForm = await apiClient.fetchGravityForm(formId)
        const containsPaymentField = loadedForm.fields.some((field) => ["product", "total", "creditcard"].includes(field.type))
        const containsPostField = loadedForm.fields.some((field) =>
          ["post_title", "post_content", "post_excerpt", "post_tags", "post_category", "post_image", "post_custom_field"].includes(field.type)
        )

        if (containsPaymentField) {
          throw new Error("Sorry, gravity-forms-react-native does not support forms with payment fields.")
        }

        if (containsPostField) {
          throw new Error("Sorry, gravity-forms-react-native does not support forms with post fields.")
        }

        setForm(loadedForm)
        initializeFormData(loadedForm.fields)
        setLoading(false)
      } catch (error) {
        console.error("Error loading form:", error)
        setLoading(false)
        setSubmissionError("Error loading form. Please try again later.")
      }
    }

    loadForm()
  }, [formId])

  const initializeFormData = (fields: GravityFormField[]) => {
    const initialData: Record<string, any> = {}
    fields.forEach((field) => {
      const fieldId = field.id.toString()
      if (field.defaultValue) {
        initialData[fieldId] = field.defaultValue
      } else if (field.type === "checkbox" || field.type === "multiselect") {
        initialData[fieldId] = []
      } else {
        initialData[fieldId] = ""
      }
    })
    setFormData(initialData)
  }

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
  }

  const handleSubmit = async () => {
    if (!form) return
    setSubmitting(true)
    setSubmissionError(null)
    setErrors({})

    const formattedData: Record<string, any> = {}
    const tempUserFriendlyData: UserFriendlySubmissionField[] = []

    form.fields.forEach((field) => {
      const fieldId = field.id.toString()
      const value = formData[fieldId]
      const fieldLabel = field.label
      const excludedFieldTypes = ["html", "page", "section", "captcha", "hidden", "fileupload"]

      if (field.visibility === "hidden" || !evaluateConditionalLogic(field) || excludedFieldTypes.includes(field.type)) {
        return
      }

      const customHandler = customFieldHandlers[field.type]
      if (customHandler) {
        const formattedValue = customHandler.formatValue(value, field)

        if (typeof formattedValue === "object" && formattedValue !== null) {
          // Handle complex custom fields with sub-fields
          Object.entries(formattedValue).forEach(([key, val]) => {
            formattedData[`input_${key}`] = val
          })
        } else {
          // Handle simple custom fields
          formattedData[`input_${fieldId}`] = formattedValue
        }

        tempUserFriendlyData.push({
          input: `input_${fieldId}`,
          name: fieldLabel,
          value: customHandler.formatUserFriendlyValue(value, field),
        })
      } else {
        switch (field.type) {
          case "consent":
            formattedData[`input_${fieldId}_1`] = value?.checked || ""
            formattedData[`input_${fieldId}_2`] = value?.label || ""
            tempUserFriendlyData.push({
              input: `input_${fieldId}_1`,
              name: fieldLabel,
              value: value?.checked ? `Consented to: ${value.label}` : `No Answer`,
            })
            break

          case "checkbox":
            if (Array.isArray(value)) {
              field.choices?.forEach((choice, index) => {
                if (value.includes(choice.value)) {
                  formattedData[`input_${fieldId}_${index + 1}`] = choice.value
                }
              })

              const joinedValues = value.join(", ")
              tempUserFriendlyData.push({
                input: `input_${fieldId}`,
                name: fieldLabel,
                value: joinedValues || "No Answer",
              })
            } else if (typeof value === "string") {
              formattedData[`input_${fieldId}`] = value
              tempUserFriendlyData.push({
                input: `input_${fieldId}`,
                name: fieldLabel,
                value: value,
              })
            } else {
              tempUserFriendlyData.push({
                input: `input_${fieldId}`,
                name: fieldLabel,
                value: "No Answer",
              })
            }
            break

          case "radio":
          case "select":
          case "multiselect":
            formattedData[`input_${fieldId}`] = value
            tempUserFriendlyData.push({
              input: `input_${fieldId}`,
              name: fieldLabel,
              value: value && value !== "" ? (Array.isArray(value) ? value.join(", ") : value) : "No Answer",
            })
            break

          case "list":
            if (Array.isArray(value) && value.length > 0) {
              if (field.enableColumns && field.choices) {
                // Multi-column list
                const columnCount = field.choices.length
                const rows = []
                for (let i = 0; i < value.length; i += columnCount) {
                  const row = value.slice(i, i + columnCount).map((item) => item || "")
                  rows.push(row)
                }
                formattedData[`input_${fieldId}`] = value
                tempUserFriendlyData.push({
                  input: `input_${fieldId}`,
                  name: fieldLabel,
                  value: rows.map((row) => row.join(", ")).join("\n"),
                })
              } else {
                // Single-column list
                formattedData[`input_${fieldId}`] = value.map((item) => item || "")
                tempUserFriendlyData.push({
                  input: `input_${fieldId}`,
                  name: fieldLabel,
                  value: value.map((item) => item || "").join("\n"),
                })
              }
            } else {
              tempUserFriendlyData.push({
                input: `input_${fieldId}`,
                name: fieldLabel,
                value: "No Answer",
              })
            }
            break

          case "name":
          case "address":
            if (typeof value === "object" && value !== null) {
              Object.keys(value).forEach((subFieldId) => {
                formattedData[`input_${fieldId}_${subFieldId.split(".")[1]}`] = value[subFieldId]
              })
              tempUserFriendlyData.push({
                input: `input_${fieldId}`,
                name: fieldLabel,
                value: Object.values(value).filter(Boolean).join(" "),
              })
            } else {
              tempUserFriendlyData.push({
                input: `input_${fieldId}`,
                name: fieldLabel,
                value: "No Answer",
              })
            }
            break

          case "date":
            if (value) {
              const dateValue = format(parse(value, dateFormat, new Date()), "P")
              formattedData[`input_${fieldId}`] = dateValue
              tempUserFriendlyData.push({
                input: `input_${fieldId}`,
                name: fieldLabel,
                value: dateValue,
              })
            } else {
              tempUserFriendlyData.push({
                input: `input_${fieldId}`,
                name: fieldLabel,
                value: "No Answer",
              })
            }
            break

          case "textarea":
          case "text":
          case "website":
          case "number":
          case "email":
          case "phone":
          case "time":
          default:
            if (value) {
              formattedData[`input_${fieldId}`] = value
              tempUserFriendlyData.push({
                input: `input_${fieldId}`,
                name: fieldLabel,
                value: value,
              })
            } else {
              tempUserFriendlyData.push({
                input: `input_${fieldId}`,
                name: fieldLabel,
                value: "No Answer",
              })
            }
            break
        }
      }
    })

    setUserFriendlyData(tempUserFriendlyData)

    try {
      const validationResponse = await apiClient.validateGravityForm(formId, formattedData)

      if (!validationResponse.is_valid) {
        handleSubmissionErrors(validationResponse.validation_messages || {})
        setSubmitting(false)
        return
      }

      const submitResponse = await apiClient.submitGravityForm(formId, formattedData)

      if (submitResponse.is_valid) {
        const defaultConfirmation = Object.values(form.confirmations).find((c) => c.isDefault)
        if (defaultConfirmation && defaultConfirmation.type === "message") {
          setConfirmationMessage(defaultConfirmation.message || "Form submitted successfully!")
        } else {
          setConfirmationMessage("Form submitted successfully!")
        }

        onSubmit?.(userFriendlyData, formData, submitResponse.entry_id)

        if (customConfirmationAction) {
          customConfirmationAction(formData, submitResponse.entry_id)
          if (!showConfirmationScreen) {
            setConfirmationMessage(null)
          }
        }
      } else {
        handleSubmissionErrors(submitResponse.validation_messages || {})
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmissionError("An error occurred while submitting the form. Please try again.")
      setErrors({})
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmissionErrors = (validationMessages: Record<string, string>) => {
    setErrors(validationMessages)
    setSubmissionError("There were errors in your submission. Please correct them and try again.")
    onValidationError?.(validationMessages)
  }

  const evaluateConditionalLogic = (field: GravityFormField): boolean => {
    if (!field.conditionalLogic || !field.conditionalLogic.enabled) return true

    const { rules, logicType } = field.conditionalLogic
    const results = rules.map((rule) => {
      const fieldValue = formData[rule.fieldId.toString()]
      switch (rule.operator) {
        case "is":
          return fieldValue === rule.value
        case "isnot":
          return fieldValue !== rule.value
        case "greater_than":
          return Number(fieldValue) > Number(rule.value)
        case "less_than":
          return Number(fieldValue) < Number(rule.value)
        case "contains":
          return String(fieldValue).includes(rule.value)
        case "starts_with":
          return String(fieldValue).startsWith(rule.value)
        case "ends_with":
          return String(fieldValue).endsWith(rule.value)
        default:
          return false
      }
    })

    return logicType === "all" ? results.every(Boolean) : results.some(Boolean)
  }

  const renderField = (field: GravityFormField) => {
    if (!evaluateConditionalLogic(field)) return null
    if (field.visibility === "hidden") return null

    const hasCustomMapping = customFieldMapping.hasOwnProperty(field.type)

    if (!hasCustomMapping) {
      const validFieldTypes = Object.values(GravityFormFieldType).map((type) => type.toLowerCase())
      if (!validFieldTypes.includes(field.type.toLowerCase())) {
        return null
      }
    }

    const FieldComponent = fieldMapping[field.type] || defaultFieldMapping[field.type] || defaultFieldMapping.text

    const fieldId = field.id.toString()
    const changeHandler = (value: any) => handleInputChange(fieldId, value)
    const fieldError = errors[fieldId]

    return (
      <FieldComponent
        key={fieldId}
        field={field}
        value={formData[fieldId]}
        onChangeText={changeHandler}
        onValueChange={changeHandler}
        error={fieldError}
        primaryColor={primaryColor}
        fieldLabelStyle={fieldLabelStyle}
        fieldDescriptionStyle={fieldDescriptionStyle}
        fieldErrorMessageStyle={fieldErrorMessageStyle}
        fieldValidationMessageStyle={fieldValidationMessageStyle}
        inputTextStyle={inputTextStyle}
        inputPlaceholderStyle={inputPlaceholderStyle}
        inputBorderColor={inputBorderColor}
        inputContainerStyle={inputContainerStyle}
        sectionTitleStyle={sectionTitleStyle}
        // Pass dropdown props (prefixed with 'dropdown')
        dropdownStyle={dropdownStyle}
        dropdownContainerStyle={dropdownContainerStyle}
        dropdownIcon={dropdownIcon}
        dropdownIconStyle={dropdownIconStyle}
        dropdownSelectedItemStyle={dropdownSelectedItemStyle}
        dropdownMultipleSelectedItemStyle={dropdownMultipleSelectedItemStyle}
        dropdownErrorStyle={dropdownErrorStyle}
        dropdownErrorTextStyle={dropdownErrorTextStyle}
        dropdownIsSearchable={dropdownIsSearchable}
        dropdownAutoCloseOnSelect={dropdownAutoCloseOnSelect}
        dropdownListEmptyComponent={dropdownListEmptyComponent}
        dropdownListComponentStyles={dropdownListComponentStyles}
        dropdownListControls={dropdownListControls}
        dropdownSearchControls={dropdownSearchControls}
        dropdownModalControls={dropdownModalControls}
        dropdownCheckboxControls={dropdownCheckboxControls}
        multipleSelectionMessage={multipleSelectionMessage}
        dateFormat={dateFormat}
        timeFormat={timeFormat}
      />
    )
  }

  const renderErrorMessages = () => {
    if (!submissionError && Object.keys(errors).length === 0) return null

    return (
      <View style={{ marginBottom: 20 }}>
        {submissionError && <Text style={[{ color: "red", marginBottom: 10 }, formErrorStyle]}>{submissionError}</Text>}
        {Object.keys(errors).length > 0 && (
          <View>
            <Text style={[{ color: "red", marginBottom: 5 }, formErrorStyle]}>Please correct the following errors:</Text>
            {Object.entries(errors).map(([fieldId, errorMessage]) => (
              <Text key={fieldId} style={[{ color: "red", marginLeft: 10 }, fieldErrorMessageStyle]}>
                • {errorMessage}
              </Text>
            ))}
          </View>
        )}
      </View>
    )
  }

  if (loading) {
    if (loadingComponent) {
      return <View style={containerStyle}>{loadingComponent}</View>
    }

    return (
      <View style={containerStyle}>
        <View style={{ flexGrow: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 3, ...loadingSpinnerStyle }}>
          <ActivityIndicator size={loadingSpinnerSize} color={loadingSpinnerColor || primaryColor} />
          <Text style={loadingTextStyle}>Loading form...</Text>
        </View>
      </View>
    )
  }

  if (confirmationMessage && !showConfirmationScreen && !customConfirmationAction) {
    return null
  }

  if (confirmationMessage) {
    if (customConfirmationComponent) {
      const CustomConfirmationComponent = customConfirmationComponent
      return (
        <ScrollView contentContainerStyle={containerStyle}>
          <CustomConfirmationComponent message={confirmationMessage} formData={formData} userFriendlyData={userFriendlyData} />
        </ScrollView>
      )
    }
    return (
      <ScrollView contentContainerStyle={containerStyle}>
        <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 15, ...confirmationMessageStyle }}>{confirmationMessage}</Text>
        {showSubmittedAnswers && (
          <>
            <Text style={{ fontSize: 28, fontWeight: "700", ...confirmationMessageStyle }}>{customSubmittedDataTitle || "Submitted Data"}</Text>
            {userFriendlyData.map((field) => (
              <View key={field.input} style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: "700", ...fieldLabelStyle, ...submittedDataQuestionStyle }}>{field.name}</Text>
                <Text
                  style={{
                    fontSize: 16,
                    ...inputTextStyle,
                    ...submittedDataAnswerStyle,
                    fontStyle: field.value === "No Answer" ? "italic" : "normal",
                  }}
                >
                  {field.value}
                </Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    )
  }

  if (!form) {
    return (
      <View style={containerStyle}>
        <Text style={formErrorStyle}>Error loading form. Please try again later.</Text>
      </View>
    )
  }

  return (
    <>
      {/* Submission Overlay */}
      {submitting &&
        (customSubmissionOverlayComponent ? (
          customSubmissionOverlayComponent
        ) : (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 3,
              zIndex: 99999,
            }}
          >
            <ActivityIndicator size={loadingSpinnerSize} color={loadingSpinnerColor || primaryColor} />
            <Text style={loadingTextStyle}>Submitting...</Text>
          </View>
        ))}
      <ScrollView contentContainerStyle={containerStyle} scrollEnabled={!submitting} pointerEvents={submitting ? "none" : "auto"}>
        {showFormTitle && <Text style={formTitleStyle}>{form.title}</Text>}
        {showFormDescription && form.description && <Text style={formDescriptionStyle}>{form.description}</Text>}
        {renderErrorMessages()}
        {form.fields.map(renderField)}
        {renderErrorMessages()}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={submitting}
          style={[
            {
              backgroundColor: primaryColor,
              width: "100%",
              borderRadius: 8,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 10,
              marginTop: 20,
            },
            submitButtonContainerStyle,
          ]}
        >
          <Text style={submitButtonTextStyle}>{submitting ? "Submitting..." : form.button.text || "Submit"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  )
}

export default GravityForm
