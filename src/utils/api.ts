import { GravityFormsApiClient, GravityFormSubmission } from "../types"

// Custom base64 encoding function without dependencies
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

  const response = await fetch(`${baseUrl}/wp-json/gf/v2${url}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export const createApiClient = (): GravityFormsApiClient => {
  const fetchGravityForm = async (formId: number) => {
    return fetchWithAuth(`/forms/${formId}`)
  }

  const submitGravityForm = async (formId: number, formData: Record<string, any>): Promise<GravityFormSubmission> => {
    console.log("Submitting data within submitGravityForm function...", formData)
    return fetchWithAuth(`/forms/${formId}/submissions`, {
      method: "POST",
      body: JSON.stringify(formData),
    })
  }

  const validateGravityForm = async (formId: number, formData: Record<string, any>): Promise<GravityFormSubmission> => {
    return fetchWithAuth(`/forms/${formId}/submissions/validation`, {
      method: "POST",
      body: JSON.stringify(formData),
    })
  }

  return { fetchGravityForm, submitGravityForm, validateGravityForm }
}
