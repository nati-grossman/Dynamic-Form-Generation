/**
 * Submission Service - Handles all submission-related API operations
 *
 * This service provides methods for:
 * - Getting all submissions
 * - Deleting submissions
 * - Managing submission data
 */

import { apiClient, handleApiCall } from "./apiService";
import { SubmissionDB, ApiResponse } from "@/types";

/**
 * Get all form submissions
 * @returns Array of submission objects
 */
export const getSubmissions = async (): Promise<SubmissionDB[]> => {
  return await handleApiCall<SubmissionDB[]>(
    () => apiClient.get("/submissions/"),
    "שגיאה בקבלת הטפסים שהוגשו"
  );
};

/**
 * Delete all form submissions
 * @returns Deletion result
 */
export const deleteAllSubmissions = async (): Promise<ApiResponse> => {
  return await handleApiCall<ApiResponse>(
    () => apiClient.delete("/submissions/"),
    "שגיאה במחיקת הטפסים"
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
    "שגיאה בקבלת הטופס"
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
    "שגיאה במחיקת הטופס"
  );
};
