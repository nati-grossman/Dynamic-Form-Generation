/**
 * File Service - Handles all file-related API operations
 *
 * This service provides methods for:
 * - Downloading files from the server
 * - Uploading files to the server
 * - Managing file operations
 */

import { API_CONFIG } from "./apiService";

/**
 * Generic fetch wrapper with timeout and error handling
 * @param url - API endpoint
 * @param options - Fetch options
 * @param timeout - Request timeout in milliseconds
 * @returns Promise with response
 */
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout: number = API_CONFIG.timeout
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error("Request timeout");
    }
    throw error;
  }
};

/**
 * Download file from API
 * @param url - API endpoint
 * @param filename - Name for downloaded file
 * @returns Download result
 */
export const downloadFile = async (
  url: string,
  filename: string
): Promise<{ success: boolean }> => {
  try {
    const fullUrl = `${API_CONFIG.baseURL}${url}`;

    const response = await fetchWithTimeout(fullUrl);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);

    return { success: true };
  } catch (error: any) {
    throw new Error("Error downloading file");
  }
};

/**
 * Upload file to API
 * @param url - API endpoint
 * @param file - File to upload
 * @param fieldName - Form field name (default: 'file')
 * @returns Upload result
 */
export const uploadFile = async <T = any>(
  url: string,
  file: File,
  fieldName: string = "file"
): Promise<T> => {
  try {
    const formData = new FormData();
    formData.append(fieldName, file);

    const fullUrl = `${API_CONFIG.baseURL}${url}`;

    const response = await fetchWithTimeout(fullUrl, {
      method: "POST",
      body: formData,
      // Don't set Content-Type for FormData, browser will set it with boundary
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.detail || `HTTP ${response.status}`;
      throw new Error(message);
    }

    return await response.json();
  } catch (error: any) {
    const message = error.message || "Error uploading file";
    throw new Error(message);
  }
};
