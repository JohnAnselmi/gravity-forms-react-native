import { TextStyle, ViewStyle } from "react-native"

export interface GravityFormFieldInput {
  id: string
  label: string
  name?: string
  autocompleteAttribute?: string
  isHidden?: boolean
  inputType?: string
  choices?: Array<{ text: string; value: string; isSelected?: boolean; price?: string }>
}

export interface GravityFormField {
  id: string
  formId: number
  type: string
  label: string
  adminLabel?: string
  isRequired: boolean
  size?: string
  errorMessage?: string
  visibility?: string
  inputs?: GravityFormFieldInput[]
  choices?: Array<{ text: string; value: string; isSelected?: boolean; price?: string }>
  description?: string
  placeholder?: string
  defaultValue?: string
  maxLength?: string
  inputMask?: boolean
  inputMaskValue?: string
  enableAutocomplete?: boolean
  allowsPrepopulate?: boolean
  conditionalLogic?: {
    enabled: boolean
    actionType: string
    logicType: string
    rules: Array<{ fieldId: string; operator: string; value: string }>
  }
  layoutGridColumnSpan?: number
  labelPlacement?: string
  descriptionPlacement?: string
  subLabelPlacement?: string
  inputType?: string
  enablePrice?: boolean | null
  basePrice?: string
  validateState?: boolean
  nameFormat?: string
  addressType?: string
  phoneFormat?: string
  rangeMin?: string
  rangeMax?: string
}

export interface GravityFormObject {
  id: number
  title: string
  description: string
  button: {
    type: string
    text: string
    imageUrl?: string
    conditionalLogic?: any
  }
  fields: GravityFormField[]
  version: string
  labelPlacement: string
  descriptionPlacement: string
  subLabelPlacement: string
  is_active: string
  date_created: string
  is_trash: string
  confirmations: { [key: string]: GravityFormConfirmation }
  notifications?: { [key: string]: GravityFormNotification }
}

export interface GravityFormConfirmation {
  id: string
  name: string
  isDefault: boolean
  type: string
  message?: string
  url?: string
  pageId?: string
  queryString?: string
  disableAutoformat?: boolean
  conditionalLogic?: any
}

export interface GravityFormNotification {
  id: string
  isActive: boolean
  to: string
  name: string
  event: string
  toType: string
  subject: string
  message: string
  from?: string
  fromName?: string
  replyTo?: string
  routing?: any[]
  conditionalLogic?: any
}

export interface GravityFormSubmission {
  is_valid: boolean
  validation_messages?: Record<string, string>
  page_number?: number
  source_page_number?: number
  confirmation_message?: string
  confirmation_type?: "message" | "redirect" | "page"
  confirmation_redirect?: string
  entry_id?: number
  resume_token?: string
}

export interface FieldMapping {
  [key: string]: React.ComponentType<any>
}

export interface GravityFormProps {
  formId: number
  customFieldMapping?: FieldMapping
  onSubmit?: (data: any) => void
  onValidationError?: (errors: Record<string, string>) => void
  containerStyle?: ViewStyle
  primaryColor?: string
  textColor?: string
  buttonTextColor?: string
  showFormTitle?: boolean
  formTitleStyle?: TextStyle
  showFormDescription?: boolean
  formDescriptionStyle?: TextStyle
  formLoadingErrorStyle?: TextStyle
  confirmationMessageStyle?: TextStyle
}

export interface GravityFormsApiClient {
  fetchGravityForm: (formId: number) => Promise<GravityFormObject>
  submitGravityForm: (formId: number, formData: Record<string, any>) => Promise<GravityFormSubmission>
  validateGravityForm: (formId: number, formData: Record<string, any>) => Promise<GravityFormSubmission>
}

// Additional utility types
export type GravityFormFieldType =
  | "text"
  | "textarea"
  | "select"
  | "multiselect"
  | "number"
  | "checkbox"
  | "radio"
  | "hidden"
  | "html"
  | "section"
  | "page"
  | "name"
  | "date"
  | "time"
  | "phone"
  | "address"
  | "website"
  | "email"
  | "fileupload"
  | "list"
  | "product"
  | "quantity"
  | "option"
  | "shipping"
  | "post_title"
  | "post_content"
  | "post_excerpt"
  | "post_tags"
  | "post_category"
  | "post_image"
  | "post_custom_field"
  | "captcha"
  | "consent"

export type GravityFormVisibility = "visible" | "hidden" | "administrative"

export type GravityFormLabelPlacement = "top_label" | "left_label" | "right_label"

export type GravityFormDescriptionPlacement = "below" | "above"

export type GravityFormSubLabelPlacement = "below" | "above"
