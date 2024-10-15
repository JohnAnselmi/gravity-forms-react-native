import {
  AddressField,
  CheckboxField,
  ConsentField,
  DateField,
  EmailField,
  ListField,
  MultiselectField,
  NameField,
  NumberField,
  PhoneField,
  RadioField,
  SectionField,
  SelectField,
  TextField,
  TextareaField,
  TimeField,
  WebsiteField,
} from "./fields"

import { FieldMapping } from "../types"

export const defaultFieldMapping: FieldMapping = {
  address: AddressField,
  checkbox: CheckboxField,
  consent: ConsentField,
  date: DateField,
  email: EmailField,
  list: ListField,
  multiselect: MultiselectField,
  name: NameField,
  number: NumberField,
  phone: PhoneField,
  radio: RadioField,
  section: SectionField,
  select: SelectField,
  text: TextField,
  textarea: TextareaField,
  time: TimeField,
  website: WebsiteField,
  hidden: () => null,
}

export const createFieldMapping = (customMapping: FieldMapping = {}): FieldMapping => ({
  ...defaultFieldMapping,
  ...customMapping,
})
