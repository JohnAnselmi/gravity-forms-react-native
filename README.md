# gravity-forms-react-native

A React Native package for seamlessly integrating Gravity Forms from WordPress into your mobile applications. This package provides components to render Gravity Forms, handle form submission, and validate form inputs directly from a React Native app.

## Table of Contents

- [Installation](#installation)
- [Setup](#setup)
- [Usage](#usage)
- [Props](#props)
- [Custom Field Mapping](#custom-field-mapping)
- [API Client Configuration](#api-client-configuration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Supported Field Types](#supported-field-types)

## Installation

To install the package, run the following command in your React Native project directory:

### If you are using Expo:

```bash
expo install @react-native-community/datetimepicker
npm install gravity-forms-react-native react-native-input-select react-native-modal-datetime-picker
```

or with Yarn:

```bash
expo install @react-native-community/datetimepicker
yarn add gravity-forms-react-native react-native-input-select react-native-modal-datetime-picker
```

### If you are not using Expo:

```bash
npm install gravity-forms-react-native @react-native-community/datetimepicker react-native-input-select react-native-modal-datetime-picker
```

or with Yarn:

```bash
yarn add gravity-forms-react-native @react-native-community/datetimepicker react-native-input-select react-native-modal-datetime-picker
```

### Peer Dependencies

Ensure that your project has the following peer dependencies installed:

- `react >=16.8.0`
- `react-native >=0.60.0`
- `@react-native-picker/picker >=1.3.0`
- `@react-native-community/datetimepicker >=6.0.0`
- `react-native-modal-datetime-picker >=14.0.0`

These are required for rendering various field types (dropdowns, date pickers, etc.).

## Setup

Before you can use gravity-forms-react-native, you need to configure your WordPress site to allow API access to Gravity Forms:

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

It is recommended to configure the API client at your app's entry point.

## Usage

Here’s a basic example of how to render and submit a Gravity Form:

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

| Prop Name                           | Type             | Required | Default   | Description                                                                     |
| ----------------------------------- | ---------------- | -------- | --------- | ------------------------------------------------------------------------------- |
| `formId`                            | number           | Yes      | -         | The ID of the Gravity Form to render.                                           |
| `customFieldMapping`                | object           | No       | `{}`      | Custom mapping for field types to React Native components.                      |
| `onSubmit`                          | function         | No       | -         | Callback function triggered on successful form submission.                      |
| `onValidationError`                 | function         | No       | -         | Callback function triggered when form validation fails.                         |
| `containerStyle`                    | ViewStyle        | No       | -         | Style for the form container.                                                   |
| `primaryColor`                      | string           | No       | '#0000ff' | Primary color for buttons and accents.                                          |
| `showFormTitle`                     | boolean          | No       | `false`   | Whether to display the form title.                                              |
| `formTitleStyle`                    | TextStyle        | No       | -         | Style for the form title.                                                       |
| `showFormDescription`               | boolean          | No       | `false`   | Whether to display the form description.                                        |
| `formDescriptionStyle`              | TextStyle        | No       | -         | Style for the form description.                                                 |
| `formErrorStyle`                    | TextStyle        | No       | -         | Style for the error message when the form fails to load.                        |
| `confirmationMessageStyle`          | TextStyle        | No       | -         | Style for the confirmation message after successful submission.                 |
| `fieldLabelStyle`                   | TextStyle        | No       | -         | Style for the label of each field.                                              |
| `fieldDescriptionStyle`             | TextStyle        | No       | -         | Style for the description of each field.                                        |
| `fieldErrorMessageStyle`            | TextStyle        | No       | -         | Style for the error messages for individual fields.                             |
| `fieldValidationMessageStyle`       | TextStyle        | No       | -         | Style for validation messages (e.g., for invalid emails, numbers, etc.).        |
| `inputTextStyle`                    | TextStyle        | No       | -         | Style for the text inside input fields.                                         |
| `inputBorderColor`                  | string           | No       | '#ccc'    | Border color for input fields.                                                  |
| `inputContainerStyle`               | ViewStyle        | No       | -         | Style for the container around input fields.                                    |
| `dropdownPlaceholderStyle`          | TextStyle        | No       | -         | Style for the dropdown placeholder text.                                        |
| `dropdownStyle`                     | ViewStyle        | No       | -         | Style for the dropdown component.                                               |
| `dropdownContainerStyle`            | ViewStyle        | No       | -         | Style for the container around the dropdown component.                          |
| `dropdownIcon`                      | ReactNode        | No       | -         | Custom icon for the dropdown.                                                   |
| `dropdownIconStyle`                 | ViewStyle        | No       | -         | Style for the dropdown icon.                                                    |
| `dropdownSelectedItemStyle`         | TextStyle        | No       | -         | Style for the selected item in the dropdown.                                    |
| `dropdownMultipleSelectedItemStyle` | ViewStyle        | No       | -         | Style for multiple selected items in the dropdown.                              |
| `dropdownErrorStyle`                | ViewStyle        | No       | -         | Style for the dropdown error container.                                         |
| `dropdownErrorTextStyle`            | TextStyle        | No       | -         | Style for the dropdown error text.                                              |
| `dropdownHelperTextStyle`           | TextStyle        | No       | -         | Style for helper text in dropdown fields.                                       |
| `dropdownIsSearchable`              | boolean          | No       | -         | Whether the dropdown supports searching.                                        |
| `dropdownAutoCloseOnSelect`         | boolean          | No       | -         | Whether the dropdown should auto-close on selecting an item.                    |
| `dropdownListEmptyComponent`        | ReactNode        | No       | -         | Custom component to display when the dropdown list is empty.                    |
| `dropdownPrimaryColor`              | string           | No       | -         | Primary color for the dropdown.                                                 |
| `dropdownListComponentStyles`       | object           | No       | -         | Additional styles for dropdown list components, such as empty list and headers. |
| `dropdownListControls`              | object           | No       | -         | Controls for selecting all/unselecting all options in a multiselect dropdown.   |
| `dropdownSearchControls`            | object           | No       | -         | Controls for managing search input inside a searchable dropdown.                |
| `dropdownModalControls`             | object           | No       | -         | Controls for the modal that wraps a dropdown in certain cases.                  |
| `dropdownCheckboxControls`          | object           | No       | -         | Controls for managing checkboxes in multiselect dropdowns.                      |
| `submitButtonContainerStyle`        | ViewStyle        | No       | -         | Style for the submit button container.                                          |
| `submitButtonTextStyle`             | TextStyle        | No       | -         | Style for the submit button text.                                               |
| `loadingTextStyle`                  | TextStyle        | No       | -         | Style for the text displayed while the form is loading.                         |
| `loadingSpinnerStyle`               | ViewStyle        | No       | -         | Style for the loading spinner.                                                  |
| `loadingSpinnerColor`               | string           | No       | -         | Color for the loading spinner.                                                  |
| `loadingSpinnerSize`                | string or number | No       | "small"   | Size of the loading spinner (`small`, `large`, or a numeric size).              |
| `loadingComponent`                  | ReactNode        | No       | -         | Custom component to display while the form is loading.                          |
| `multipleSelectionMessage`          | string           | No       | -         | Message to display for multi-selection fields (e.g., checkboxes).               |

## Custom Field Mapping

You can map your own components to custom field types or override the default ones provided by the package.

1. Create a custom field component:

```jsx
import React from "react"
import { TextInput } from "react-native"

const CustomTextField = ({ field, value, onChangeText, error }) => (
  <TextInput value={value} onChangeText={onChangeText} placeholder={field.label} style={{ borderColor: error ? "red" : "gray", borderWidth: 1 }} />
)

export default CustomTextField
```

2. Define the custom field mapping:

```javascript
const customFieldMapping = {
  text: CustomTextField,
  // Other field mappings as needed
}
```

3. Use the custom mapping in the `GravityForm` component:

```jsx
<GravityForm formId={1} customFieldMapping={customFieldMapping} />
```

## API Client Configuration

To connect with the Gravity Forms API, you need to configure the API client. This is done globally using the `configureApiClient` function:

```javascript
import { configureApiClient } from "gravity-forms-react-native"

configureApiClient({
  baseUrl: "https://your-wordpress-site.com",
  consumerKey: "your_consumer_key",
  consumerSecret: "your_consumer_secret",
})
```

Make sure to call this before rendering any `GravityForm` components.

## Troubleshooting

1. **Form doesn’t load**: Double-check the API credentials and ensure the form ID exists in your WordPress site.
2. **Field rendering issues**: Ensure custom field mappings are provided for unsupported field types.
3. **Form submission fails**: Ensure your WordPress site is accessible and the Gravity Forms REST API is correctly set up.

For additional issues, check the [issues page](https://github.com/yourusername/gravity-forms-react-native/issues) or create a new issue.

## Supported Field Types

The following Gravity Forms field types are supported:

- `text`
- `textarea`
- `select`
- `multiselect`
- `checkbox`
- `radio`
- `name`
- `address`
- `phone`
- `email`
- `website`
- `number`
- `list`
- `date`
- `time`

### Unsupported Fields

At this time, the following fields will not render in the form:

- `html` (future support planned)
- `page` (future support planned)
- `captcha` (maybe?)

The following fields will cause an error if used in a form rendered with `gravity-forms-react-native`:

- Payment fields (e.g., product, total, credit card) (no support planned)
- Post fields (e.g., post title, post content, post category) (future support planned)

## Contributing

Contributions are welcome! To contribute:

1. Clone the repository.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.
