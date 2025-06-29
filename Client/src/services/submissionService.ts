/**
 * Submission Service - Handles all submission-related API operations
 *
 * This service provides methods for:
 * - Getting all submissions
 * - Deleting submissions
 * - Managing submission data
 */

import { apiClient, handleApiCall } from "./apiService";
import { SubmissionDB, ApiResponse } from "@/types/typesExports";

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
 * Delete all form submissions
 * @returns Deletion result
 */
export const deleteAllSubmissions = async (): Promise<ApiResponse> => {
  return await handleApiCall<ApiResponse>(
    () => apiClient.delete("/submissions/"),
    "Error deleting forms"
  );
};
