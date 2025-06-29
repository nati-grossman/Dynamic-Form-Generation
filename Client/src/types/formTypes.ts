/**
 * Form Types - Types related to form schemas and validation
 *
 * This file contains types for form fields, validation rules, and form schemas.
 */

// Form Field Types
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
