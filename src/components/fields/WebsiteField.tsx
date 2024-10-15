import React, { useState, useEffect, useRef } from "react"
import { View, TextInput, Text, TouchableOpacity, LayoutChangeEvent } from "react-native"
import { FieldComponentProps } from "../../types"
import CommonWrapper from "./CommonWrapper"

const WebsiteField: React.FC<FieldComponentProps> = (props) => {
  const {
    field,
    value,
    onChangeText,
    error,
    primaryColor,
    fieldLabelStyle,
    fieldDescriptionStyle,
    fieldErrorMessageStyle,
    fieldValidationMessageStyle,
    inputTextStyle,
    inputBorderColor,
    inputContainerStyle,
    inputPlaceholderStyle,
  } = props

  if (field.visibility === "hidden" || field.visibility === "administrative") return null

  const [protocol, setProtocol] = useState("https://")
  const [inputValue, setInputValue] = useState("")
  const [isValid, setIsValid] = useState(true)
  const [protocolWidth, setProtocolWidth] = useState(0)
  const inputRef = useRef<TextInput>(null)

  const websiteRegex = /^(https?:\/\/)?([\w.-]+)+(:\d+)?(\/([\w/_.]*)?)?$/

  useEffect(() => {
    if (value) {
      const match = value.match(/^(https?:\/\/)(.*)/)
      if (match) {
        setProtocol(match[1])
        setInputValue(match[2])
      } else {
        setInputValue(value)
      }
    }
  }, [value])

  const validateWebsite = (url: string) => {
    const isValidUrl = websiteRegex.test(url)
    setIsValid(isValidUrl)
    return isValidUrl
  }

  const handleWebsiteChange = (text: string) => {
    if (text.startsWith("http://") || text.startsWith("https://")) {
      const newProtocol = text.startsWith("https://") ? "https://" : "http://"
      setProtocol(newProtocol)
    }
    setInputValue(text)
    validateWebsite(text)
    onChangeText!(text)
  }

  const toggleProtocol = () => {
    const newProtocol = protocol === "https://" ? "http://" : "https://"
    setProtocol(newProtocol)
  }

  const handleSubmit = () => {
    let finalValue = inputValue
    if (finalValue.startsWith("http://") || finalValue.startsWith("https://")) {
      finalValue = finalValue.replace(/^https?:\/\//, "")
    }
    const fullValue = `${protocol}${finalValue}`
    onChangeText!(fullValue)
  }

  const handleProtocolLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout
    setProtocolWidth(width)
    if (inputRef.current) {
      inputRef.current.setNativeProps({ style: { paddingLeft: width } })
    }
  }

  return (
    <CommonWrapper
      field={field}
      error={error}
      primaryColor={primaryColor!}
      fieldLabelStyle={fieldLabelStyle}
      fieldDescriptionStyle={fieldDescriptionStyle}
      fieldErrorMessageStyle={fieldErrorMessageStyle}
    >
      <View style={{ position: "relative" }}>
        <TextInput
          ref={inputRef}
          style={[
            {
              borderWidth: 1,
              borderColor: error ? "red" : isValid ? inputBorderColor : "orange",
              borderRadius: 5,
              padding: 10,
              paddingLeft: protocolWidth + 1,
            },
            inputTextStyle,
            inputContainerStyle,
          ]}
          value={inputValue}
          onChangeText={handleWebsiteChange}
          onBlur={handleSubmit}
          keyboardType="url"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={field.placeholder}
          placeholderTextColor={inputPlaceholderStyle?.color}
        />
        <TouchableOpacity
          onPress={toggleProtocol}
          onLayout={handleProtocolLayout}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            justifyContent: "center",
            paddingLeft: 10,
          }}
        >
          <Text style={[inputTextStyle, { textDecorationLine: "underline" }]}>{protocol}</Text>
        </TouchableOpacity>
      </View>
      {!isValid && <Text style={[{ color: "orange", fontSize: 12, marginTop: 3 }, fieldValidationMessageStyle]}>Please enter a valid website URL</Text>}
    </CommonWrapper>
  )
}

export default WebsiteField
