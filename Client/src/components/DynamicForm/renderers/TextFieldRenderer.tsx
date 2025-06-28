/**
 * Text Field Renderer - Renders text, email, and password fields
 *
 * This component handles:
 * - Text input fields
 * - Email input fields
 * - Password input fields
 * - Tel (telephone) input fields
 */

import React from "react";
import { TextField } from "@mui/material";
import { FieldRendererProps } from "../types";

/**
 * Render text, email, password, or tel field
 */
export const TextFieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  formik,
  formErrors,
}) => {
  const fieldError =
    formErrors[field.name] || (formik.errors as any)[field.name];
  const fieldTouched = (formik.touched as any)[field.name];

  return (
    <TextField
      fullWidth
      id={field.name}
      name={field.name}
      label={field.label}
      type={field.type}
      value={formik.values[field.name] ?? ""}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={fieldTouched && Boolean(fieldError)}
      helperText={fieldTouched && fieldError}
      required={field.required}
    />
  );
};
