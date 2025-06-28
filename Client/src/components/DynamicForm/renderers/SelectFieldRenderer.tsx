/**
 * Select Field Renderer - Renders dropdown/select fields
 *
 * This component handles:
 * - Single-select dropdown fields
 * - Dynamic option rendering
 * - Proper Material-UI FormControl integration
 */

import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { FieldRendererProps } from "../types";

/**
 * Render dropdown/select field with dynamic options
 */
export const SelectFieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  formik,
  formErrors,
}) => {
  const fieldError =
    formErrors[field.name] || (formik.errors as any)[field.name];
  const fieldTouched = (formik.touched as any)[field.name];

  return (
    <FormControl
      fullWidth
      error={fieldTouched && Boolean(fieldError)}
      required={field.required}
    >
      <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
      <Select
        labelId={`${field.name}-label`}
        id={field.name}
        name={field.name}
        value={formik.values[field.name] ?? ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        label={field.label}
      >
        {field.options?.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {fieldTouched && fieldError && (
        <FormHelperText>{fieldError}</FormHelperText>
      )}
    </FormControl>
  );
};
