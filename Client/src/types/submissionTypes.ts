/**
 * Submission Types - Types related to form submissions
 *
 * This file contains types for form submissions and database records.
 */

import { FieldStat } from "./statisticsTypes";

// Form Submission Types
export interface FormSubmission {
  data: Record<string, any>;
  submitted_at: string;
}

export interface FormSubmissionResponse {
  success: boolean;
  errors?: Record<string, string[]>;
  message: string;
}

export interface SubmissionDB {
  id: string;
  form_title: string;
  data: string | Record<string, any>; // JSON string or object
  submitted_at: string;
  fields_mapping: FieldStat[] | Record<string, string>; // Support both old and new formats
}
