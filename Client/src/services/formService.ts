/**
 * Form Service - Handles all form-related API operations
 *
 * This service provides methods for:
 * - Downloading example files
 * - Uploading form schemas
 * - Getting current schema
 * - Submitting form data
 */

import {
  apiClient,
  handleApiCall,
  downloadFile,
  uploadFile,
} from "./apiService";
import { FormSchema, FormSubmissionResponse, ApiResponse } from "@/types";

/**
 * Download example form JSON file
 * @returns Download result
 */
export const downloadExample = async (): Promise<{ success: boolean }> => {
  return await downloadFile("/forms/download-example", "example_form.json");
};

/**
 * Upload form schema JSON file
 * @param file - JSON file to upload
 * @returns Upload result with form_id and schema
 */
export const uploadSchema = async (
  file: File
): Promise<{ message: string; form_id: string; schema: FormSchema }> => {
  return await uploadFile<{
    message: string;
    form_id: string;
    schema: FormSchema;
  }>("/forms/upload-schema", file);
};

/**
 * Get current form schema
 * @returns Current schema object
 */
export const getCurrentSchema = async (): Promise<FormSchema> => {
  return await handleApiCall<FormSchema>(
    () => apiClient.get("/forms/current-schema"),
    "שגיאה בקבלת סכמת הטופס"
  );
};

/**
 * Submit form data for validation and storage
 * @param formData - Form submission data
 * @returns Submission result with success/errors
 */
export const submitForm = async (formData: {
  form_id: string;
  data: Record<string, any>;
}): Promise<FormSubmissionResponse> => {
  try {
    const response = await apiClient.post("/forms/submit", formData);
    const data = await response.json();
    return data;
  } catch (error: any) {
    // Handle validation errors specifically
    if (error.response?.data) {
      return error.response.data;
    }
    throw new Error("שגיאה בשליחת הטופס");
  }
};
