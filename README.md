# gravity-forms-react-native

A React Native module for rendering and submitting Gravity Forms.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Custom Field Mapping](#custom-field-mapping)
- [Configuration](#configuration)
- [Types](#types)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
npm install gravity-forms-react-native
```

or

```bash
yarn add gravity-forms-react-native
```

### Peer Dependencies

This plugin requires the following peer dependencies:

- React >= 16.8.0
- React Native >= 0.60.0

Please ensure these are installed in your main project.

## Usage

First, configure the API client with your Gravity Forms API credentials:

```typescript
import { configureApiClient } from "gravity-forms-react-native"

configureApiClient({
  baseUrl: "https://your-wordpress-site.com",
  consumerKey: "your-consumer-key",
  consumerSecret: "your-consumer-secret",
})
```

Then, use the `GravityFormRenderer` component in your React Native app:

```typescript
import React from "react"
import { View } from "react-native"
import { GravityFormRenderer } from "gravity-forms-react-native"

const MyFormScreen = () => {
  return (
    <View>
      <GravityFormRenderer formId={1} />
    </View>
  )
}

export default MyFormScreen
```

## API

### GravityFormRenderer

The main component for rendering Gravity Forms.

Props:

- `formId` (number): The ID of the Gravity Form to render.
- `customFieldMapping` (optional): An object mapping field types to custom React components.

### createApiClient

Creates an instance of the Gravity Forms API client.

```typescript
import { createApiClient } from "gravity-forms-react-native"

const apiClient = createApiClient()
```

### createFieldMapping

Creates a field mapping object, combining default mappings with custom ones.

```typescript
import { createFieldMapping } from "gravity-forms-react-native"

const customMapping = {
  // Your custom field components
}

const fieldMapping = createFieldMapping(customMapping)
```

## Custom Field Mapping

You can provide custom React components for different field types:

```typescript
import { GravityFormRenderer, createFieldMapping } from "gravity-forms-react-native"
import MyCustomTextInput from "./MyCustomTextInput"

const customFieldMapping = {
  text: MyCustomTextInput,
  // Add other custom field components here
}

const MyForm = () => <GravityFormRenderer formId={1} customFieldMapping={customFieldMapping} />
```

## Configuration

Before using the module, configure the API client:

```typescript
import { configureApiClient } from "gravity-forms-react-native"

configureApiClient({
  baseUrl: "https://your-wordpress-site.com/wp-json",
  consumerKey: "your-consumer-key",
  consumerSecret: "your-consumer-secret",
})
```

## Types

This module exports TypeScript types for Gravity Forms structures:

- `GravityFormField`
- `GravityForm`
- `GravityFormEntry`
- `GravityFormSubmission`
- `FieldMapping`
- `GravityFormRendererProps`
- `GravityFormsApiClient`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the UNLICENSED license.
