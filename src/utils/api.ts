import axios from "axios"
import { GravityFormsApiClient, GravityFormSubmission } from "../types"

// Helper function to create Basic Auth headers
const createBasicAuthHeader = (consumerKey: string, consumerSecret: string) => {
  const token = btoa(`${consumerKey}:${consumerSecret}`)
  return `Basic ${token}`
}

let globalApiConfig = { baseUrl: "", consumerKey: "", consumerSecret: "" }

export const configureApiClient = (config: { baseUrl: string; consumerKey: string; consumerSecret: string }) => {
  globalApiConfig = config
}

export const createApiClient = (): GravityFormsApiClient => {
  const { baseUrl, consumerKey, consumerSecret } = globalApiConfig
  const client = axios.create({
    baseURL: `${baseUrl}/wp-json/gf/v2`,
    headers: {
      Authorization: createBasicAuthHeader(consumerKey, consumerSecret),
      "Content-Type": "application/json",
    },
  })

  const fetchGravityForm = async (formId: number) => {
    const response = await client.get(`/forms/${formId}`)
    return response.data
  }

  const submitGravityForm = async (formId: number, formData: Record<string, any>): Promise<GravityFormSubmission> => {
    const response = await client.post(`/forms/${formId}/submissions`, formData)
    return response.data
  }

  const validateGravityForm = async (formId: number, formData: Record<string, any>): Promise<GravityFormSubmission> => {
    const response = await client.post(`/forms/${formId}/submissions/validation`, formData)
    return response.data
  }

  return { fetchGravityForm, submitGravityForm, validateGravityForm }
}
