/**
 * Type Definitions - Centralized type definitions for the application
 *
 * This file contains all shared types and interfaces used throughout
 * the application for type safety and better development experience.
 */

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

// Form Schema Types
export interface DropdownOption {
  value: string;
  label: string;
}

export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  minDate?: string;
  maxDate?: string;
  email?: boolean;
  pattern?: string;
}

export interface FieldErrorMessages {
  required?: string;
  minLength?: string;
  maxLength?: string;
  min?: string;
  max?: string;
  minDate?: string;
  maxDate?: string;
  email?: string;
  pattern?: string;
  invalidOption?: string;
}

export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "date" | "number" | "dropdown";
  required: boolean;
  validation?: FieldValidation;
  errorMessages?: FieldErrorMessages;
  options?: DropdownOption[];
}

export interface FormSchema {
  title: string;
  fields: FormField[];
}

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

// Database Types
export interface SubmissionDB {
  id: number;
  form_title: string;
  data: string | Record<string, any>; // JSON string or object
  submitted_at: string;
  fields_mapping?: { name: string; label: string }[] | Record<string, string>; // Support both old and new formats
}

// Statistics Types
export interface FormStatistics {
  total_submissions: number;
  total_forms: number;
  forms: FormStat[];
}

export interface FormStat {
  title: string;
  count: number;
  fields: FieldStat[];
}

export interface FieldStat {
  label: string;
}

// UI State Types
export type MessageType = "success" | "error" | "warning" | "info";

export interface Message {
  message: string;
  type: MessageType;
}

// App State Types
export interface AppState {
  // Form data
  schema: FormSchema | null;
  submissions: SubmissionDB[];

  // UI state
  loading: boolean;
  message: string;
  messageType: MessageType;
  showMessage: boolean;

  // Form state
  formErrors: Record<string, string[]>;
  isFormValid: boolean;
}

// Action Types
export interface AppAction {
  type: string;
  payload?: any;
}

// Service Types
export interface ApiClient {
  get: (url: string, config?: any) => Promise<any>;
  post: (url: string, data?: any, config?: any) => Promise<any>;
  put: (url: string, data?: any, config?: any) => Promise<any>;
  delete: (url: string, config?: any) => Promise<any>;
}

// Component Props Types
export interface FileUploadProps {
  // Add props if needed
}

export interface MessageDisplayProps {
  // Add props if needed
}

export interface DynamicFormProps {
  schema: FormSchema | null;
  onSubmit: (formData: Record<string, any>) => Promise<FormSubmissionResponse>;
  onReset: () => void;
}

export interface SubmissionsListProps {
  submissions: SubmissionDB[];
  onDeleteAll: () => Promise<void>;
  loading: boolean;
}

// Event Types
export interface FileUploadEvent {
  target: {
    files: FileList | null;
    value: string;
  };
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & { [P in K]-?: T[P] };
