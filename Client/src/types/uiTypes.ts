/**
 * UI Types - Types related to user interface and state management
 *
 * This file contains types for UI state, messages, and component props.
 */

import { FormSchema } from "./formTypes";
import { SubmissionDB, FormSubmissionResponse } from "./submissionTypes";

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
  loading?: boolean;
}
