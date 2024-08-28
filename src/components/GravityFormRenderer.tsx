import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { View, Button, Text, ActivityIndicator, ViewStyle } from "react-native"
import { createApiClient } from "../utils/api"
import { createFieldMapping, defaultFieldMapping } from "./FieldMapping"
import { GravityFormProps, GravityFormObject, GravityFormField } from "../types"

const GravityForm: React.FC<GravityFormProps> = React.memo(
  ({
    formId,
    customFieldMapping = {},
    onSubmit,
    onValidationError,
    containerStyle,
    buttonColor,
    formTitleStyle,
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
        } else if (field.type === "name" || field.type === "address") {
          initialData[field.id] = {}
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

      try {
        const validationResponse = await apiClient.validateGravityForm(formId, formData)

        if (!validationResponse.is_valid) {
          setErrors(validationResponse.validation_messages || {})
          onValidationError?.(validationResponse.validation_messages || {})
          setSubmitting(false)
          return
        }

        const submitResponse = await apiClient.submitGravityForm(formId, formData)

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
        console.error("Error submitting form:", error)
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

      return (
        <FieldComponent
          key={field.id}
          field={field}
          value={formData[field.id]}
          onChangeText={(value: any) => handleInputChange(field.id, value)}
          error={errors[field.id]}
        />
      )
    }

    if (loading) {
      return (
        <View style={containerStyle}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading form...</Text>
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
        <Text style={formTitleStyle}>{form.title}</Text>
        {form.description && <Text style={formDescriptionStyle}>{form.description}</Text>}
        {form.fields.map(renderField)}
        <Button title={submitting ? "Submitting..." : form.button.text || "Submit"} onPress={handleSubmit} disabled={submitting} color={buttonColor} />
      </View>
    )
  }
)

export default GravityForm
