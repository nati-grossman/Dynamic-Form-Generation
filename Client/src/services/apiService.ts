/**
 * API Service - Centralized API communication layer
 *
 * This service handles all HTTP requests to the backend server,
 * including error handling, request/response interceptors, and
 * centralized configuration using native fetch API.
 */

import { ApiClient } from "@/types";

// API Configuration
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

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
 * Generic API request handler with error processing
 * @param apiCall - The API function to call
 * @param errorMessage - Default error message
 * @returns API response or throws error
 */
const handleApiCall = async <T = any>(
  apiCall: () => Promise<Response>,
  errorMessage: string = "General error"
): Promise<T> => {
  try {
    const response = await apiCall();

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message =
        errorData.detail || errorData.message || `HTTP ${response.status}`;
      throw new Error(message);
    }

    return await response.json();
  } catch (error: any) {
    const message = error.message || errorMessage;
    throw new Error(message);
  }
};

/**
 * Download file from API
 * @param url - API endpoint
 * @param filename - Name for downloaded file
 * @returns Download result
 */
const downloadFile = async (
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
const uploadFile = async <T = any>(
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

/**
 * API client with common HTTP methods
 */
const apiClient: ApiClient = {
  get: async (url: string, config?: any) => {
    const fullUrl = `${API_CONFIG.baseURL}${url}`;
    const headers = { ...API_CONFIG.headers, ...config?.headers };

    return fetchWithTimeout(fullUrl, {
      method: "GET",
      headers,
    });
  },

  post: async (url: string, data?: any, config?: any) => {
    const fullUrl = `${API_CONFIG.baseURL}${url}`;
    const headers = { ...API_CONFIG.headers, ...config?.headers };

    return fetchWithTimeout(fullUrl, {
      method: "POST",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  put: async (url: string, data?: any, config?: any) => {
    const fullUrl = `${API_CONFIG.baseURL}${url}`;
    const headers = { ...API_CONFIG.headers, ...config?.headers };

    return fetchWithTimeout(fullUrl, {
      method: "PUT",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  delete: async (url: string, config?: any) => {
    const fullUrl = `${API_CONFIG.baseURL}${url}`;
    const headers = { ...API_CONFIG.headers, ...config?.headers };

    return fetchWithTimeout(fullUrl, {
      method: "DELETE",
      headers,
    });
  },
};

export { apiClient, handleApiCall, downloadFile, uploadFile };
