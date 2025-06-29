/**
 * Statistics Service - Handles all statistics-related API operations
 *
 * This service provides methods for:
 * - Getting form submission statistics
 * - Managing statistics data
 */

import { apiClient, handleApiCall } from "./apiService";
import { FormStatistics } from "@/types/typesExports";

/**
 * Get form submission statistics
 * @returns Statistics object with form counts and field information
 */
export const getStatistics = async (): Promise<FormStatistics> => {
  return await handleApiCall<FormStatistics>(
    () => apiClient.get("/statistics"),
    "Error getting statistics"
  );
};
