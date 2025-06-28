/**
 * DynamicForm Validation - Yup validation logic for dynamic forms
 *
 * This module handles:
 * - Field-specific validation rules
 * - Required field validation
 * - Type-specific validation (text, email, password, date, number, dropdown)
 */

import * as yup from "yup";
import { FormField } from "@/types";
import { ValidationSchema } from "./types";

/**
 * Create validation schema for a specific field type
 * @param field - Form field configuration
 * @returns Yup validation schema
 */
export const createFieldValidation = (field: FormField): yup.AnySchema => {
  let fieldValidation: any;

  switch (field.type) {
    case "text":
      fieldValidation = yup.string();
      if (field.required) {
        fieldValidation = fieldValidation.required(
          field.errorMessages?.required || `${field.label} הוא שדה חובה`
        );
      }
      if (field.validation?.minLength) {
        fieldValidation = fieldValidation.min(
          field.validation.minLength,
          field.errorMessages?.minLength ||
            `מינימום ${field.validation.minLength} תווים`
        );
      }
      if (field.validation?.maxLength) {
        fieldValidation = fieldValidation.max(
          field.validation.maxLength,
          field.errorMessages?.maxLength ||
            `מקסימום ${field.validation.maxLength} תווים`
        );
      }
      if (field.validation?.pattern) {
        fieldValidation = fieldValidation.matches(
          new RegExp(field.validation.pattern),
          field.errorMessages?.pattern || "ערך לא תקין"
        );
      }
      break;

    case "email":
      fieldValidation = yup
        .string()
        .email(field.errorMessages?.email || "כתובת אימייל לא תקינה");
      if (field.required) {
        fieldValidation = fieldValidation.required(
          field.errorMessages?.required || `${field.label} הוא שדה חובה`
        );
      }
      break;

    case "password":
      fieldValidation = yup.string();
      if (field.required) {
        fieldValidation = fieldValidation.required(
          field.errorMessages?.required || `${field.label} הוא שדה חובה`
        );
      }
      if (field.validation?.minLength) {
        fieldValidation = fieldValidation.min(
          field.validation.minLength,
          field.errorMessages?.minLength ||
            `מינימום ${field.validation.minLength} תווים`
        );
      }
      if (field.validation?.pattern) {
        fieldValidation = fieldValidation.matches(
          new RegExp(field.validation.pattern),
          field.errorMessages?.pattern || "סיסמה לא עומדת בדרישות"
        );
      }
      break;

    case "date":
      fieldValidation = yup.date();
      if (field.required) {
        fieldValidation = fieldValidation.required(
          field.errorMessages?.required || `${field.label} הוא שדה חובה`
        );
      }
      if (field.validation?.minDate) {
        fieldValidation = fieldValidation.min(
          field.validation.minDate,
          field.errorMessages?.minDate || "תאריך מוקדם מדי"
        );
      }
      if (field.validation?.maxDate) {
        fieldValidation = fieldValidation.max(
          field.validation.maxDate,
          field.errorMessages?.maxDate || "תאריך מאוחר מדי"
        );
      }
      break;

    case "number":
      fieldValidation = yup.number();
      if (field.required) {
        fieldValidation = fieldValidation.required(
          field.errorMessages?.required || `${field.label} הוא שדה חובה`
        );
      }
      if (field.validation?.min !== undefined) {
        fieldValidation = fieldValidation.min(
          field.validation.min,
          field.errorMessages?.min || `ערך מינימלי: ${field.validation.min}`
        );
      }
      if (field.validation?.max !== undefined) {
        fieldValidation = fieldValidation.max(
          field.validation.max,
          field.errorMessages?.max || `ערך מקסימלי: ${field.validation.max}`
        );
      }
      break;

    case "dropdown":
      const validOptions = field.options?.map((opt) => opt.value) || [];
      fieldValidation = yup
        .string()
        .oneOf(
          validOptions,
          field.errorMessages?.invalidOption || "אפשרות לא תקינה"
        );
      if (field.required) {
        fieldValidation = fieldValidation.required(
          field.errorMessages?.required || `${field.label} הוא שדה חובה`
        );
      }
      break;

    default:
      fieldValidation = yup.string();
  }

  return fieldValidation;
};

/**
 * Create complete validation schema for all form fields
 * @param fields - Array of form fields
 * @returns Complete Yup validation schema
 */
export const createValidationSchema = (
  fields: FormField[]
): ValidationSchema => {
  const validationObject: ValidationSchema = {};

  fields.forEach((field: FormField) => {
    validationObject[field.name] = createFieldValidation(field);
  });

  return validationObject;
};
