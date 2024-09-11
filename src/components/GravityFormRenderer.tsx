import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { View, Button, Text, ActivityIndicator, TouchableOpacity } from "react-native"
import { createApiClient } from "../utils/api"
import { createFieldMapping, defaultFieldMapping } from "./FieldMapping"
import { GravityFormProps, GravityFormObject, GravityFormField } from "../types"
import axios from "axios"

const GravityForm: React.FC<GravityFormProps> = React.memo(
  ({
    formId,
    customFieldMapping = {},
    onSubmit,
    onValidationError,
    containerStyle,
    primaryColor = "#0000ff",
    textColor = "#000000",
    buttonTextColor = "#ffffff",
    showFormTitle = false,
    formTitleStyle,
    showFormDescription = false,
    formDescriptionStyle,
    formLoadingErrorStyle,
    confirmationMessageStyle,
  }) => {
    const [form, setForm] = useState<GravityFormObject | null>(null)
    const [formData, setFormData] = useState<Record<string, any>>({})
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null)

    const apiClient = createApiClient()
    const fieldMapping = useMemo(() => createFieldMapping(customFieldMapping), [customFieldMapping])

    useEffect(() => {
      const loadForm = async () => {
        try {
          const loadedForm = await apiClient.fetchGravityForm(formId)
          const containsPaymentField = loadedForm.fields.some((field) => ["product", "total", "creditcard"].includes(field.type))
          const containsPostField = loadedForm.fields.some((field) =>
            ["post_title", "post_content", "post_excerpt", "post_tags", "post_category", "post_image"].includes(field.type)
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
        }
      }

      loadForm()
    }, [formId])

    const initializeFormData = (fields: GravityFormField[]) => {
      const initialData: Record<string, any> = {}
      fields.forEach((field) => {
        if (field.defaultValue) {
          initialData[field.id] = field.defaultValue
        } else if (field.type === "checkbox") {
          initialData[field.id] = []
        } else {
          initialData[field.id] = ""
        }
      })
      setFormData(initialData)
    }

    const handleInputChange = (fieldId: string, value: any) => {
      setFormData((prev) => ({ ...prev, [fieldId]: value }))
      setErrors((prev) => ({ ...prev, [fieldId]: "" }))
    }

    const handleSubmit = async () => {
      if (!form) return
      setSubmitting(true)

      const formattedData: Record<string, any> = {}

      form.fields.forEach((field) => {
        const fieldId = field.id.toString()
        const value = formData[fieldId]

        if (field.type === "checkbox" || field.type === "radio") {
          if (Array.isArray(value)) {
            // Multi-checkbox
            field.choices?.forEach((choice, index) => {
              if (value.includes(choice.value)) {
                formattedData[`input_${fieldId}_${index + 1}`] = choice.value
              }
            })
          } else if (typeof value === "string") {
            // Single checkbox or radio button
            formattedData[`input_${fieldId}`] = value
          }
        } else if (typeof value === "object" && value !== null) {
          // Handle multi-input fields (like name or address)
          Object.keys(value).forEach((subFieldId) => {
            formattedData[`input_${fieldId}_${subFieldId.split(".")[1]}`] = value[subFieldId]
          })
        } else {
          // Handle other field types
          formattedData[`input_${fieldId}`] = value
        }
      })

      console.log("Formatted form data:", formattedData)

      try {
        const validationResponse = await apiClient.validateGravityForm(formId, formattedData)

        if (!validationResponse.is_valid) {
          setErrors(validationResponse.validation_messages || {})
          onValidationError?.(validationResponse.validation_messages || {})
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
          onSubmit?.(formData)
        } else {
          setErrors(submitResponse.validation_messages || {})
          onValidationError?.(submitResponse.validation_messages || {})
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error submitting form:", error.response?.data || error.message)
        } else {
          console.error("Error submitting form:", error)
        }
        setConfirmationMessage("An error occurred while submitting the form. Please try again.")
      } finally {
        setSubmitting(false)
      }
    }

    const evaluateConditionalLogic = (field: GravityFormField): boolean => {
      if (!field.conditionalLogic || !field.conditionalLogic.enabled) return true

      const { rules, logicType } = field.conditionalLogic
      const results = rules.map((rule) => {
        const fieldValue = formData[rule.fieldId]
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

      const FieldComponent = fieldMapping[field.type] || defaultFieldMapping[field.type] || defaultFieldMapping.text

      const changeHandler = (value: any) => handleInputChange(field.id, value)

      return (
        <FieldComponent
          key={field.id}
          field={field}
          value={formData[field.id]}
          onChangeText={changeHandler}
          onValueChange={changeHandler}
          error={errors[field.id]}
          primaryColor={primaryColor}
          textColor={textColor}
        />
      )
    }

    if (loading) {
      return (
        <View style={containerStyle}>
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 }}>
            <ActivityIndicator size="small" color={primaryColor} />
            <Text>Loading form...</Text>
          </View>
        </View>
      )
    }

    if (confirmationMessage) {
      return (
        <View style={containerStyle}>
          <Text style={confirmationMessageStyle}>{confirmationMessage}</Text>
        </View>
      )
    }

    if (!form) {
      return (
        <View style={containerStyle}>
          <Text style={formLoadingErrorStyle}>Error loading form. Please try again later.</Text>
        </View>
      )
    }

    return (
      <View style={containerStyle}>
        {showFormTitle && <Text style={formTitleStyle}>{form.title}</Text>}
        {showFormDescription && form.description && <Text style={formDescriptionStyle}>{form.description}</Text>}
        {form.fields.map(renderField)}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={submitting}
          style={{ backgroundColor: buttonTextColor, width: "100%", borderRadius: 8, justifyContent: "center", alignItems: "center", paddingVertical: 10 }}
        >
          <Text style={{ color: textColor }}>{submitting ? "Submitting..." : form.button.text || "Submit"}</Text>
        </TouchableOpacity>
      </View>
    )
  }
)

export default GravityForm
