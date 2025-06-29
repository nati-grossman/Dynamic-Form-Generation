/**
 * Date Field Renderer - Renders date input fields
 *
 * This component handles:
 * - Date picker fields
 * - Automatic label shrinking for better UX
 * - Date format validation
 */

import React from "react";
import { TextField } from "@mui/material";
import { FieldRendererProps } from "../dynamicFormTypes";

/**
 * Render date field with proper formatting and validation
 */
export const DateFieldRenderer: React.FC<FieldRendererProps> = ({
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
      type="date"
      value={formik.values[field.name] ?? ""}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={fieldTouched && Boolean(fieldError)}
      helperText={fieldTouched && fieldError}
      required={field.required}
      InputLabelProps={{
        shrink: true,
      }}
      inputProps={{
        lang: "en-US",
      }}
    />
  );
};
