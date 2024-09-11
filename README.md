# gravity-forms-react-native

A React Native module for seamlessly integrating Gravity Forms from WordPress into your mobile application.

## Table of Contents

- [Installation](#installation)
- [Setup](#setup)
- [Usage](#usage)
- [Props](#props)
- [Custom Field Mapping](#custom-field-mapping)
- [API Client Configuration](#api-client-configuration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Installation

To install the gravity-forms-react-native package, run the following command in your project directory:

```bash
npm install gravity-forms-react-native @react-native-picker/picker
```

or if you're using Yarn:

```bash
yarn add gravity-forms-react-native @react-native-picker/picker
```

Note: This package has a peer dependency on `@react-native-picker/picker`, which is used for select fields.

## Setup

Before you can use gravity-forms-react-native, you need to set up your WordPress site to allow API access to Gravity Forms.

1. Install and activate the [Gravity Forms REST API add-on](https://docs.gravityforms.com/rest-api-v2/) on your WordPress site.

2. Generate API credentials:

   - Go to Forms > Settings > REST API in your WordPress admin panel.
   - Create a new API key with read and write permissions for forms and entries.

3. In your React Native project, configure the API client with your credentials:

```javascript
import { configureApiClient } from "gravity-forms-react-native"

configureApiClient({
  baseUrl: "https://your-wordpress-site.com",
  consumerKey: "your_consumer_key",
  consumerSecret: "your_consumer_secret",
})
```

It's recommended to do this configuration in your app's entry point (e.g., `App.js` or `index.js`).

## Usage

Here's a basic example of how to use the `GravityForm` component:

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

| Prop Name                  | Type      | Required | Default   | Description                                                           |
| -------------------------- | --------- | -------- | --------- | --------------------------------------------------------------------- |
| `formId`                   | number    | Yes      | -         | The ID of the Gravity Form to render                                  |
| `customFieldMapping`       | object    | No       | `{}`      | Custom field type to component mapping                                |
| `onSubmit`                 | function  | No       | -         | Callback function called on successful form submission                |
| `onValidationError`        | function  | No       | -         | Callback function called when form validation fails                   |
| `containerStyle`           | ViewStyle | No       | -         | Style object for the form container                                   |
| `primaryColor`             | string    | No       | '#0000ff' | Primary color used for buttons and accents                            |
| `showFormTitle`            | boolean   | No       | `false`   | Whether to display the form title                                     |
| `formTitleStyle`           | TextStyle | No       | -         | Style object for the form title                                       |
| `showFormDescription`      | boolean   | No       | `false`   | Whether to display the form description                               |
| `formDescriptionStyle`     | TextStyle | No       | -         | Style object for the form description                                 |
| `formLoadingErrorStyle`    | TextStyle | No       | -         | Style object for the error message when form fails to load            |
| `confirmationMessageStyle` | TextStyle | No       | -         | Style object for the confirmation message after successful submission |

## Custom Field Mapping

You can create custom components for specific field types or override the default ones. Here's how to create and use a custom field mapping:

1. Create your custom field component:

```jsx
import React from "react"
import { TextInput } from "react-native"

const MyCustomTextField = ({ field, value, onChangeText, error }) => (
  <TextInput value={value} onChangeText={onChangeText} placeholder={field.label} style={{ borderColor: error ? "red" : "gray", borderWidth: 1 }} />
)

export default MyCustomTextField
```

2. Create a custom field mapping object:

```javascript
import MyCustomTextField from "./MyCustomTextField"

const customFieldMapping = {
  text: MyCustomTextField,
  // Add more custom mappings as needed
}
```

3. Pass the custom field mapping to the `GravityForm` component:

```jsx
<GravityForm
  formId={1}
  customFieldMapping={customFieldMapping}
  // ... other props
/>
```

You can override any of the default field types: `text`, `textarea`, `select`, `checkbox`, `radio`, `name`, `address`, `phone`, etc.

## API Client Configuration

The `createApiClient` function is used internally to communicate with your WordPress site's Gravity Forms API. You can configure it globally using the `configureApiClient` function:

```javascript
import { configureApiClient } from "gravity-forms-react-native"

configureApiClient({
  baseUrl: "https://your-wordpress-site.com",
  consumerKey: "your_consumer_key",
  consumerSecret: "your_consumer_secret",
})
```

Make sure to call this function before rendering any `GravityForm` components.

## Troubleshooting

Here are some common issues and their solutions:

1. **Form doesn't load**: Ensure that your API credentials are correct and that the form ID exists on your WordPress site.

2. **Fields not rendering correctly**: Check if you need to provide custom field mappings for any special field types used in your form.

3. **Submission fails**: Verify that your WordPress site is accessible and that the Gravity Forms REST API add-on is active.

4. **Validation errors**: Make sure all required fields are filled and that the data matches the expected format for each field type.

If you encounter any other issues, please check the [issues page](https://github.com/yourusername/gravity-forms-react-native/issues) on GitHub or create a new issue if your problem isn't already reported.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
