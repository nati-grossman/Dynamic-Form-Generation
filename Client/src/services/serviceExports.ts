/**
 * Services Index - Centralized exports for all services
 *
 * This file provides convenient imports for all service modules
 */

// API Service
export {
  apiClient,
  handleApiCall,
  downloadFile,
  uploadFile,
} from "./apiService";

// Form Service
export {
  downloadExample,
  uploadSchema,
  getCurrentSchema,
  submitForm,
} from "./formService";

// Submission Service
export {
  getSubmissions,
  deleteAllSubmissions,
  getStatistics,
} from "./submissionService";
