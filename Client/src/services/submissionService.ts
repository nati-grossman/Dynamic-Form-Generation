/**
 * Submission Service - Handles all submission-related API operations
 *
 * This service provides methods for:
 * - Getting all submissions
 * - Deleting submissions
 * - Managing submission data
 */

import { apiClient, handleApiCall } from "./apiService";
import { SubmissionDB, ApiResponse, FormStatistics } from "@/types";

/**
 * Get all form submissions
 * @returns Array of submission objects
 */
export const getSubmissions = async (): Promise<SubmissionDB[]> => {
  return await handleApiCall<SubmissionDB[]>(
    () => apiClient.get("/submissions/"),
    "Error getting submitted forms"
  );
};

/**
 * Get form submission statistics
 * @returns Statistics object with form counts and field information
 */
export const getStatistics = async (): Promise<FormStatistics> => {
  return await handleApiCall<FormStatistics>(
    () => apiClient.get("/submissions/statistics"),
    "Error getting statistics"
  );
};

/**
 * Delete all form submissions
 * @returns Deletion result
 */
export const deleteAllSubmissions = async (): Promise<ApiResponse> => {
  return await handleApiCall<ApiResponse>(
    () => apiClient.delete("/submissions/"),
    "Error deleting forms"
  );
};

/**
 * Get submission by ID (for future use)
 * @param id - Submission ID
 * @returns Submission object
 */
export const getSubmissionById = async (id: string): Promise<SubmissionDB> => {
  return await handleApiCall<SubmissionDB>(
    () => apiClient.get(`/submissions/${id}`),
    "Error getting form"
  );
};

/**
 * Delete submission by ID (for future use)
 * @param id - Submission ID
 * @returns Deletion result
 */
export const deleteSubmissionById = async (
  id: string
): Promise<ApiResponse> => {
  return await handleApiCall<ApiResponse>(
    () => apiClient.delete(`/submissions/${id}`),
    "Error deleting form"
  );
};
