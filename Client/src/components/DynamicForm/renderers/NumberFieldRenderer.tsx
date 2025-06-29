/**
 * Number Field Renderer - Renders numeric input fields
 *
 * This component handles:
 * - Number input fields
 * - Automatic numeric validation
 * - Min/max value constraints
 */

import React from "react";
import { TextField } from "@mui/material";
import { FieldRendererProps } from "../dynamicFormTypes";

/**
 * Render number field with numeric validation
 */
export const NumberFieldRenderer: React.FC<FieldRendererProps> = ({
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
      type="number"
      value={formik.values[field.name] ?? ""}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={fieldTouched && Boolean(fieldError)}
      helperText={fieldTouched && fieldError}
      required={field.required}
    />
  );
};
