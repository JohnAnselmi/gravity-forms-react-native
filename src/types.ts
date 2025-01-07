import { ColorValue, ModalProps, TextInputProps, TextStyle, ViewStyle } from "react-native"

export enum GravityFormFieldType {
  // Standard Fields
  Text = "text",
  Textarea = "textarea",
  Select = "select",
  Number = "number",
  Checkbox = "checkbox",
  Radio = "radio",
  Hidden = "hidden",
  Section = "section",

  // Advanced Fields
  Name = "name",
  Date = "date",
  Time = "time",
  Phone = "phone",
  Address = "address",
  Website = "website",
  Email = "email",
  List = "list",
  Multiselect = "multiselect",
  Consent = "consent",

  //Future Fields
  // FileUpload = "fileupload",
  // Captcha = "captcha",
  // HTML = "html",
  // Page = "page",
}

export interface GravityFormFieldInput {
  id: string | number
  label: string
  name?: string
  autocompleteAttribute?: string
  isHidden?: boolean
  inputType?: string
  choices?: Array<{ text: string; value: string; isSelected?: boolean; price?: string }>
}

export interface GravityFormField {
  id: number
  formId: number
  type: string
  label: string
  adminLabel?: string
  isRequired: boolean
  size?: string
  errorMessage?: string
  visibility?: GravityFormVisibility
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
  labelPlacement?: GravityFormLabelPlacement
  descriptionPlacement?: GravityFormDescriptionPlacement
  subLabelPlacement?: GravityFormSubLabelPlacement
  inputType?: string
  enablePrice?: boolean | null
  basePrice?: string
  validateState?: boolean
  nameFormat?: string
  addressType?: string
  phoneFormat?: string
  rangeMin?: string
  rangeMax?: string
  checkboxLabel?: string
  enableColumns?: boolean
  maxRows?: number
  enableOtherChoice?: boolean
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

export interface UserFriendlySubmissionField {
  input: string
  name: string
  value: any
}

export interface GravityFormProps {
  formId: number
  customFieldMapping?: FieldMapping
  onSubmit?: (data: any, entryId?: number) => void
  onValidationError?: (errors: Record<string, string>) => void
  containerStyle?: ViewStyle
  primaryColor?: string
  showFormTitle?: boolean
  formTitleStyle?: TextStyle
  showFormDescription?: boolean
  formDescriptionStyle?: TextStyle
  formErrorStyle?: TextStyle
  confirmationMessageStyle?: TextStyle
  fieldLabelStyle?: TextStyle
  fieldDescriptionStyle?: TextStyle
  fieldErrorMessageStyle?: TextStyle
  fieldValidationMessageStyle?: TextStyle
  sectionTitleStyle?: TextStyle
  inputTextStyle?: TextStyle
  inputPlaceholderStyle?: TextStyle
  inputBorderColor?: string
  inputContainerStyle?: ViewStyle
  // Dropdown styling props (prefixed with 'dropdown')
  dropdownStyle?: ViewStyle
  dropdownContainerStyle?: ViewStyle
  dropdownIcon?: React.ReactNode
  dropdownIconStyle?: ViewStyle
  dropdownSelectedItemStyle?: TextStyle
  dropdownMultipleSelectedItemStyle?: ViewStyle
  dropdownErrorStyle?: ViewStyle
  dropdownErrorTextStyle?: TextStyle
  dropdownIsSearchable?: boolean
  dropdownAutoCloseOnSelect?: boolean
  dropdownListEmptyComponent?: React.ReactNode
  dropdownListComponentStyles?: {
    listEmptyComponentStyle?: ViewStyle
    itemSeparatorStyle?: ViewStyle
    sectionHeaderStyle?: ViewStyle
  }
  dropdownListControls?: {
    selectAllText?: string
    unselectAllText?: string
    selectAllCallback?: () => void
    unselectAllCallback?: () => void
    hideSelectAll?: boolean
    emptyListMessage?: string
  }
  dropdownSearchControls?: {
    textInputStyle?: TextStyle
    textInputContainerStyle?: ViewStyle
    textInputProps?: TextInputProps
    searchCallback?: (value: string) => void
  }
  dropdownModalControls?: {
    modalBackgroundStyle?: ViewStyle
    modalOptionsContainerStyle?: ViewStyle
    modalProps?: ModalProps
  }
  dropdownCheckboxControls?: {
    checkboxSize?: number
    checkboxStyle?: ViewStyle
    checkboxLabelStyle?: TextStyle
    checkboxComponent?: React.ReactNode
    checkboxDisabledStyle?: ViewStyle
    checkboxUnselectedColor?: ColorValue
  }
  submitButtonContainerStyle?: ViewStyle
  submitButtonTextStyle?: TextStyle
  loadingTextStyle?: TextStyle
  loadingSpinnerStyle?: ViewStyle
  loadingSpinnerColor?: string
  loadingSpinnerSize?: number | "small" | "large"
  loadingComponent?: React.ReactNode
  multipleSelectionMessage?: string
  dateFormat?: string
  timeFormat?: string
  showConfirmationScreen?: boolean
  customConfirmationAction?: (formData: Record<string, any>, entryId?: number) => void
  showSubmittedAnswers?: boolean
  customSubmittedDataTitle?: string
  submittedDataQuestionStyle?: TextStyle
  submittedDataAnswerStyle?: TextStyle
  customConfirmationComponent?: React.ComponentType<{
    message: string
    formData: Record<string, any>
    userFriendlyData: Record<string, any>
  }>
  customSubmissionOverlayComponent?: React.ReactNode
  customFieldHandlers?: CustomFieldHandlers
}

export interface FieldComponentProps {
  field: GravityFormField
  value: any
  onChangeText?: (text: string) => void
  onValueChange?: (value: any) => void
  error?: string
  primaryColor: string
  fieldLabelStyle?: TextStyle
  fieldDescriptionStyle?: TextStyle
  fieldErrorMessageStyle?: TextStyle
  fieldValidationMessageStyle?: TextStyle
  sectionTitleStyle?: TextStyle
  inputTextStyle?: TextStyle
  inputPlaceholderStyle?: TextStyle
  inputBorderColor?: string
  inputContainerStyle?: ViewStyle
  // Dropdown styling props (prefixed with 'dropdown')
  dropdownStyle?: ViewStyle
  dropdownContainerStyle?: ViewStyle
  dropdownIcon?: React.ReactNode
  dropdownIconStyle?: ViewStyle
  dropdownSelectedItemStyle?: TextStyle
  dropdownMultipleSelectedItemStyle?: ViewStyle
  dropdownErrorStyle?: ViewStyle
  dropdownErrorTextStyle?: TextStyle
  dropdownIsSearchable?: boolean
  dropdownAutoCloseOnSelect?: boolean
  dropdownListEmptyComponent?: React.ReactNode
  dropdownListComponentStyles?: {
    listEmptyComponentStyle?: ViewStyle
    itemSeparatorStyle?: ViewStyle
    sectionHeaderStyle?: ViewStyle
  }
  dropdownListControls?: {
    selectAllText?: string
    unselectAllText?: string
    selectAllCallback?: () => void
    unselectAllCallback?: () => void
    hideSelectAll?: boolean
    emptyListMessage?: string
  }
  dropdownSearchControls?: {
    textInputStyle?: TextStyle
    textInputContainerStyle?: ViewStyle
    textInputProps?: TextInputProps
    searchCallback?: (value: string) => void
  }
  dropdownModalControls?: {
    modalBackgroundStyle?: ViewStyle
    modalOptionsContainerStyle?: ViewStyle
    modalProps?: ModalProps
  }
  dropdownCheckboxControls?: {
    checkboxSize?: number
    checkboxStyle?: ViewStyle
    checkboxLabelStyle?: TextStyle
    checkboxComponent?: React.ReactNode
    checkboxDisabledStyle?: ViewStyle
    checkboxUnselectedColor?: ColorValue
  }
  multipleSelectionMessage?: string
  dateFormat?: string
  timeFormat?: string
  [key: string]: any
}

export interface FieldMapping {
  [key: string]: React.FC<FieldComponentProps>
}

export interface CustomFieldHandler {
  formatValue: (value: any, field: GravityFormField) => any
  formatUserFriendlyValue: (value: any, field: GravityFormField) => string
}

export interface CustomFieldHandlers {
  [fieldType: string]: CustomFieldHandler
}

export interface GravityFormsApiClient {
  fetchGravityForm: (formId: number) => Promise<GravityFormObject>
  submitGravityForm: (formId: number, formData: Record<string, any>) => Promise<GravityFormSubmission>
  validateGravityForm: (formId: number, formData: Record<string, any>) => Promise<GravityFormSubmission>
}

export type GravityFormVisibility = "visible" | "hidden" | "administrative"
export type GravityFormLabelPlacement = "top_label" | "left_label" | "right_label"
export type GravityFormDescriptionPlacement = "below" | "above"
export type GravityFormSubLabelPlacement = "below" | "above"
