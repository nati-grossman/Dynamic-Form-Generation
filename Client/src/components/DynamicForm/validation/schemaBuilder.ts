/**
 * Schema Builder - Creates complete validation schema for form
 *
 * This module handles:
 * - Building complete validation schema from multiple fields
 * - Combining individual field validations into a single schema
 */

import { FormField } from "@/types/typesExports";
import { ValidationSchema } from "../dynamicFormTypes";
import { createFieldValidation } from "./fieldValidationBuilder";

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
