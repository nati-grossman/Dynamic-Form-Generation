/**
 * DynamicForm Types - Type definitions specific to DynamicForm component
 */

import { FormField } from "@/types/appTypes";
import { AnySchema } from "yup";

export interface ValidationSchema {
  [key: string]: AnySchema;
}

export interface FieldValidationConfig {
  field: FormField;
  validationSchema: AnySchema;
}

export interface FieldRendererProps {
  field: FormField;
  formik: any;
  formErrors: Record<string, string[]>;
}
