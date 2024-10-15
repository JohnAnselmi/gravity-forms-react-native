import { GravityFormObject, GravityFormsApiClient, GravityFormSubmission } from "../types"

// base64 encode
const base64Encode = (str: string): string => {
  const b64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  let result = ""
  let i = 0
  do {
    const a = str.charCodeAt(i++)
    const b = str.charCodeAt(i++)
    const c = str.charCodeAt(i++)
    result += b64chars.charAt(a >> 2)
    result += b64chars.charAt(((a & 3) << 4) | ((b || 0) >> 4))
    result += b ? b64chars.charAt(((b & 15) << 2) | ((c || 0) >> 6)) : "="
    result += b ? (c ? b64chars.charAt(c & 63) : "=") : "="
  } while (i < str.length)
  return result
}

// Helper function to create Basic Auth headers
const createBasicAuthHeader = (consumerKey: string, consumerSecret: string) => {
  const token = base64Encode(`${consumerKey}:${consumerSecret}`)
  return `Basic ${token}`
}

let globalApiConfig = { baseUrl: "", consumerKey: "", consumerSecret: "" }

export const configureApiClient = (config: { baseUrl: string; consumerKey: string; consumerSecret: string }) => {
  globalApiConfig = config
}

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const { baseUrl, consumerKey, consumerSecret } = globalApiConfig
  const headers = new Headers(options.headers)
  headers.set("Authorization", createBasicAuthHeader(consumerKey, consumerSecret))
  headers.set("Content-Type", "application/json")

  const fullUrl = `${baseUrl}/wp-json/gf/v2${url}`

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  })

  const responseBody = await response.text()
  let jsonData: any
  try {
    jsonData = JSON.parse(responseBody)
  } catch (e) {
    console.error(`Failed to parse JSON response: ${responseBody}`)
    throw new Error(`Failed to parse JSON response: ${responseBody}`)
  }

  if (!response.ok) {
    // Handle validation errors (HTTP 400 with validation messages)
    if (response.status === 400 && jsonData && jsonData.validation_messages) {
      return jsonData
    }

    console.error(`HTTP error! status: ${response.status}, body: ${responseBody}`)
    throw new Error(`HTTP error! status: ${response.status}, body: ${responseBody}`)
  }

  return jsonData
}

export const createApiClient = (): GravityFormsApiClient => {
  const fetchGravityForm = async (formId: number): Promise<GravityFormObject> => {
    const data = await fetchWithAuth(`/forms/${formId}`)
    return data as GravityFormObject
  }

  const submitGravityForm = async (formId: number, formData: Record<string, any>): Promise<GravityFormSubmission> => {
    const data = await fetchWithAuth(`/forms/${formId}/submissions`, {
      method: "POST",
      body: JSON.stringify(formData),
    })
    return data as GravityFormSubmission
  }

  const validateGravityForm = async (formId: number, formData: Record<string, any>): Promise<GravityFormSubmission> => {
    const data = await fetchWithAuth(`/forms/${formId}/submissions/validation`, {
      method: "POST",
      body: JSON.stringify(formData),
    })
    return data as GravityFormSubmission
  }

  return { fetchGravityForm, submitGravityForm, validateGravityForm }
}
