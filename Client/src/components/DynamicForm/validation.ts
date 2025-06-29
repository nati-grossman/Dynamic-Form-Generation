/**
 * DynamicForm Validation - Yup validation logic for dynamic forms
 *
 * This module handles:
 * - Field-specific validation rules
 * - Required field validation
 * - Type-specific validation (text, email, password, date, number, dropdown)
 */

import * as yup from "yup";
import { FormField } from "@/types/appTypes";
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
          field.errorMessages?.required || `${field.label} is required`
        );
      }
      if (field.validation?.minLength) {
        fieldValidation = fieldValidation.min(
          field.validation.minLength,
          field.errorMessages?.minLength ||
            `Minimum ${field.validation.minLength} characters`
        );
      }
      if (field.validation?.maxLength) {
        fieldValidation = fieldValidation.max(
          field.validation.maxLength,
          field.errorMessages?.maxLength ||
            `Maximum ${field.validation.maxLength} characters`
        );
      }
      if (field.validation?.pattern) {
        fieldValidation = fieldValidation.matches(
          new RegExp(field.validation.pattern),
          field.errorMessages?.pattern || "Invalid value"
        );
      }
      break;

    case "email":
      fieldValidation = yup
        .string()
        .email(field.errorMessages?.email || "Invalid email address");
      if (field.required) {
        fieldValidation = fieldValidation.required(
          field.errorMessages?.required || `${field.label} is required`
        );
      }
      break;

    case "password":
      fieldValidation = yup.string();
      if (field.required) {
        fieldValidation = fieldValidation.required(
          field.errorMessages?.required || `${field.label} is required`
        );
      }
      if (field.validation?.minLength) {
        fieldValidation = fieldValidation.min(
          field.validation.minLength,
          field.errorMessages?.minLength ||
            `Minimum ${field.validation.minLength} characters`
        );
      }
      if (field.validation?.pattern) {
        fieldValidation = fieldValidation.matches(
          new RegExp(field.validation.pattern),
          field.errorMessages?.pattern || "Password does not meet requirements"
        );
      }
      break;

    case "date":
      fieldValidation = yup.date();
      if (field.required) {
        fieldValidation = fieldValidation.required(
          field.errorMessages?.required || `${field.label} is required`
        );
      }
      if (field.validation?.minDate) {
        fieldValidation = fieldValidation.min(
          field.validation.minDate,
          field.errorMessages?.minDate || "Date is too early"
        );
      }
      if (field.validation?.maxDate) {
        fieldValidation = fieldValidation.max(
          field.validation.maxDate,
          field.errorMessages?.maxDate || "Date is too late"
        );
      }
      break;

    case "number":
      fieldValidation = yup.number();
      if (field.required) {
        fieldValidation = fieldValidation.required(
          field.errorMessages?.required || `${field.label} is required`
        );
      }
      if (field.validation?.min !== undefined) {
        fieldValidation = fieldValidation.min(
          field.validation.min,
          field.errorMessages?.min || `Minimum value: ${field.validation.min}`
        );
      }
      if (field.validation?.max !== undefined) {
        fieldValidation = fieldValidation.max(
          field.validation.max,
          field.errorMessages?.max || `Maximum value: ${field.validation.max}`
        );
      }
      break;

    case "dropdown":
      const validOptions = field.options?.map((opt) => opt.value) || [];
      fieldValidation = yup
        .string()
        .oneOf(
          validOptions,
          field.errorMessages?.invalidOption || "Invalid option"
        );
      if (field.required) {
        fieldValidation = fieldValidation.required(
          field.errorMessages?.required || `${field.label} is required`
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
