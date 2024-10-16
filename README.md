# gravity-forms-react-native

Integrate Gravity Forms into your React Native application. This package renders forms, handles form submissions, and validates form inputs using React Native core components where possible (third party libraries are used for some components, like date pickers and dropdowns).

## Table of Contents

- [Installation](#installation)
- [Setup](#setup)
- [Usage](#usage)
- [Props](#props)
- [Supported Field Types](#supported-field-types)
- [Custom Field Mapping](#custom-field-mapping)
- [Custom Field Handlers](#custom-field-handlers)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Installation

### For Expo users:

If you're using Expo, run the following commands in your React Native project directory:

```bash
expo install @react-native-community/datetimepicker
npm install gravity-forms-react-native react-native-input-select react-native-modal-datetime-picker date-fns
```

or with Yarn:

```bash
expo install @react-native-community/datetimepicker
yarn add gravity-forms-react-native react-native-input-select react-native-modal-datetime-picker date-fns
```

### For non-Expo React Native projects:

If you're not using Expo, run the following command in your React Native project directory:

```bash
npm install gravity-forms-react-native @react-native-community/datetimepicker react-native-input-select react-native-modal-datetime-picker date-fns
```

or with Yarn:

```bash
yarn add gravity-forms-react-native @react-native-community/datetimepicker react-native-input-select react-native-modal-datetime-picker date-fns
```

### Peer Dependencies

Ensure that your project has the following peer dependencies installed:

- `@react-native-community/datetimepicker >=6.0.0`
- `react-native-input-select >=1.0.0`
- `react-native-modal-datetime-picker >=14.0.0`
- `date-fns >=4.1.0`

These are required for rendering various field types (dropdowns, date pickers, etc.). You could also use your own components for these fields if you want to specifically avoid any of these dependencies. These are for date, time, select, and multiselect fields. All other default fields only depend on React Native core components. Thanks to all the devs of these packages for making this much easier.

## Setup

Before using gravity-forms-react-native, configure your WordPress site to allow API access to Gravity Forms:

1. Install and activate [Gravity Forms](https://docs.gravityforms.com/) on your WordPress site.
2. Generate API credentials by going to `Forms > Settings > REST API` in the WordPress admin panel. Enable the API & use API version 2. Assign Read/Write permissions to the key.
3. Configure the API client in your React Native project:

```javascript
import { configureApiClient } from "gravity-forms-react-native"

configureApiClient({
  baseUrl: "https://your-wordpress-site.com",
  consumerKey: "your_consumer_key",
  consumerSecret: "your_consumer_secret",
})
```

It's recommended to configure the API client at your app's entry point.

## Usage

Here's a basic example of how to render and submit a Gravity Form:

```jsx
import React from "react"
import { View } from "react-native"
import { GravityForm } from "gravity-forms-react-native"

const MyFormScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <GravityForm
        formId={1}
        onSubmit={(data) => console.log("Form submitted:", data)}
        onValidationError={(errors) => console.log("Validation errors:", errors)}
      />
    </View>
  )
}

export default MyFormScreen
```

## Props

The `GravityForm` component accepts the following props:

| Prop Name                           | Type             | Required | Default   | Description                                                                   |
| ----------------------------------- | ---------------- | -------- | --------- | ----------------------------------------------------------------------------- |
| `formId`                            | number           | Yes      | -         | The ID of the Gravity Form to render.                                         |
| `customFieldMapping`                | object           | No       | `{}`      | Custom mapping for field types to React Native components.                    |
| `onSubmit`                          | function         | No       | -         | Callback function triggered on successful form submission.                    |
| `onValidationError`                 | function         | No       | -         | Callback function triggered when form validation fails.                       |
| `containerStyle`                    | ViewStyle        | No       | -         | Style for the form container.                                                 |
| `primaryColor`                      | string           | No       | '#0000ff' | Primary color for buttons and accents.                                        |
| `showFormTitle`                     | boolean          | No       | `false`   | Whether to display the form title.                                            |
| `formTitleStyle`                    | TextStyle        | No       | -         | Style for the form title.                                                     |
| `showFormDescription`               | boolean          | No       | `false`   | Whether to display the form description.                                      |
| `formDescriptionStyle`              | TextStyle        | No       | -         | Style for the form description.                                               |
| `formErrorStyle`                    | TextStyle        | No       | -         | Style for the error message when the form fails to load.                      |
| `confirmationMessageStyle`          | TextStyle        | No       | -         | Style for the confirmation message after successful submission.               |
| `fieldLabelStyle`                   | TextStyle        | No       | -         | Style for the label of each field.                                            |
| `fieldDescriptionStyle`             | TextStyle        | No       | -         | Style for the description of each field.                                      |
| `fieldErrorMessageStyle`            | TextStyle        | No       | -         | Style for the error messages for individual fields.                           |
| `fieldValidationMessageStyle`       | TextStyle        | No       | -         | Style for validation messages (e.g., for invalid emails, numbers, etc.).      |
| `inputTextStyle`                    | TextStyle        | No       | -         | Style for the text inside input fields.                                       |
| `inputPlaceholderStyle`             | TextStyle        | No       | -         | Style for the placeholder text in input fields.                               |
| `inputBorderColor`                  | string           | No       | '#ccc'    | Border color for input fields.                                                |
| `inputContainerStyle`               | ViewStyle        | No       | -         | Style for the container around input fields.                                  |
| `sectionTitleStyle`                 | TextStyle        | No       | -         | Style for section titles.                                                     |
| `dropdownStyle`                     | ViewStyle        | No       | -         | Style for the dropdown component.                                             |
| `dropdownContainerStyle`            | ViewStyle        | No       | -         | Style for the container around the dropdown component.                        |
| `dropdownIcon`                      | ReactNode        | No       | -         | Custom icon for the dropdown.                                                 |
| `dropdownIconStyle`                 | ViewStyle        | No       | -         | Style for the dropdown icon.                                                  |
| `dropdownSelectedItemStyle`         | TextStyle        | No       | -         | Style for the selected item in the dropdown.                                  |
| `dropdownMultipleSelectedItemStyle` | ViewStyle        | No       | -         | Style for multiple selected items in the dropdown.                            |
| `dropdownErrorStyle`                | ViewStyle        | No       | -         | Style for the dropdown error container.                                       |
| `dropdownErrorTextStyle`            | TextStyle        | No       | -         | Style for the dropdown error text.                                            |
| `dropdownIsSearchable`              | boolean          | No       | -         | Whether the dropdown supports searching.                                      |
| `dropdownAutoCloseOnSelect`         | boolean          | No       | -         | Whether the dropdown should auto-close on selecting an item.                  |
| `dropdownListEmptyComponent`        | ReactNode        | No       | -         | Custom component to display when the dropdown list is empty.                  |
| `dropdownListComponentStyles`       | object           | No       | -         | Additional styles for dropdown list components.                               |
| `dropdownListControls`              | object           | No       | -         | Controls for selecting all/unselecting all options in a multiselect dropdown. |
| `dropdownSearchControls`            | object           | No       | -         | Controls for managing search input inside a searchable dropdown.              |
| `dropdownModalControls`             | object           | No       | -         | Controls for the modal that wraps a dropdown in certain cases.                |
| `dropdownCheckboxControls`          | object           | No       | -         | Controls for managing checkboxes in multiselect dropdowns.                    |
| `submitButtonContainerStyle`        | ViewStyle        | No       | -         | Style for the submit button container.                                        |
| `submitButtonTextStyle`             | TextStyle        | No       | -         | Style for the submit button text.                                             |
| `loadingTextStyle`                  | TextStyle        | No       | -         | Style for the text displayed while the form is loading.                       |
| `loadingSpinnerStyle`               | ViewStyle        | No       | -         | Style for the loading spinner.                                                |
| `loadingSpinnerColor`               | string           | No       | -         | Color for the loading spinner.                                                |
| `loadingSpinnerSize`                | string or number | No       | "small"   | Size of the loading spinner (`small`, `large`, or a numeric size).            |
| `loadingComponent`                  | ReactNode        | No       | -         | Custom component to display while the form is loading.                        |
| `multipleSelectionMessage`          | string           | No       | -         | Message to display for multi-selection fields.                                |
| `dateFormat`                        | string           | No       | "PPP"     | Format for date fields (using date-fns format).                               |
| `timeFormat`                        | string           | No       | "pp"      | Format for time fields (using date-fns format).                               |
| `showSubmittedAnswers`              | boolean          | No       | true      | Whether to show submitted answers after form submission.                      |
| `customSubmittedDataTitle`          | string           | No       | -         | Custom title for the submitted data section.                                  |
| `submittedDataQuestionStyle`        | TextStyle        | No       | -         | Style for the question text in the submitted data section.                    |
| `submittedDataAnswerStyle`          | TextStyle        | No       | -         | Style for the answer text in the submitted data section.                      |
| `customConfirmationComponent`       | ReactNode        | No       | -         | Custom component to display after form submission.                            |
| `customSubmissionOverlayComponent`  | ReactNode        | No       | -         | Custom component to display while the form is submitting.                     |
| `customFieldHandlers`               | object           | No       | -         | Custom handlers for formatting field values before submission.                |

## Supported Field Types

The following Gravity Forms field types are supported:

- Text
- Textarea
- Select
- Multiselect
- Checkbox
- Radio
- Name
- Address
- Phone
- Email
- Website
- Number
- Date
- Time
- List
- Consent
- Section

The following field types are not supported and will not be rendered:

- Page (future support planned. Feel free to contribute!)
- HTML (future support planned. Feel free to contribute!)
- File Upload (future support planned. Feel free to contribute!)
- Captcha
- Payment Fields
- Post Fields

## Custom Field Mapping

You can map your own components from a UI library to custom field types or override the default ones. Here's an example using a hypothetical UI library called "MyUILibrary":

```jsx
import { createCustomField } from "gravity-forms-react-native"
import { TextField } from "MyUILibrary"

const CustomTextField = ({ field, value, onChangeText, error }) => (
  <TextField value={value} onChangeText={onChangeText} placeholder={field.label} />
)

const customFieldMapping = {
  text: createCustomField(CustomTextField),
}

<GravityForm formId={1} customFieldMapping={customFieldMapping} />
```

## Custom Field Handlers

You can also provide custom handlers for specific field types. Here is the type for a custom field handler:

```jsx
export interface CustomFieldHandler {
  formatValue: (value: any, field: GravityFormField) => any
  formatUserFriendlyValue: (value: any, field: GravityFormField) => string
}
```

For example, you can create a custom handler for the `Date` field:

```jsx
import { createCustomFieldHandler } from "gravity-forms-react-native"

const customDateHandler = createCustomFieldHandler(customDateField, {
  formatValue: (value, field) => {
    return value ? format(value, "yyyy-MM-dd") : null
  },
  formatUserFriendlyValue: (value, field) => {
    return value ? format(value, "MMM d, yyyy") : "No Date Provided"
  },
})

<GravityForm formId={1} customFieldMapping={{ date: customDateField }} customFieldHandlers={{ date: customDateHandler }} />
```

If you don't submit a custom field handler for a field type, the deafault will be used:

```jsx
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
```

## Troubleshooting

1. **Form doesn't load**: Double-check the API credentials and ensure the form ID exists in your WordPress site.
2. **Field rendering issues**: Ensure custom field mappings are provided for unsupported field types.
3. **Form submission fails**: Ensure your WordPress site is accessible and the Gravity Forms REST API is correctly set up.

For additional issues, check the [issues page](https://github.com/JohnAnselmi/gravity-forms-react-native/issues) or create a new issue.

## Contributing

Contributions are welcome! To contribute:

1. Clone the repository (`git clone https://github.com/JohnAnselmi/gravity-forms-react-native.git`).
2. Create a new branch for your feature (`git checkout -b feature/AmazingFeature`).
3. Make your changes and commit them (`git commit -m 'Add AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License.
