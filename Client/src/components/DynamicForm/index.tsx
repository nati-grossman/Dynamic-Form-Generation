/**
 * DynamicForm Component - Main component for dynamic form rendering
 *
 * This component provides:
 * - Dynamic field rendering based on schema
 * - Form validation and submission
 * - Error handling and display
 */

import React, { useState, useEffect } from "react";
import { Button, Box, Typography, Paper, Grid } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { DynamicFormProps } from "@/types/appTypes";
import { createValidationSchema } from "./validation";
import { FieldRenderer } from "./fieldRenderer";

const DynamicForm: React.FC<DynamicFormProps> = ({
  schema,
  onSubmit,
  onReset,
}) => {
  const [validationSchema, setValidationSchema] = useState<any>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (schema) {
      const schemaObject = createValidationSchema(schema.fields);
      setValidationSchema(yup.object().shape(schemaObject));

      // Reset form errors when schema changes
      setFormErrors({});
    }
    // eslint-disable-next-line
  }, [schema]);

  const getInitialValueForField = (field: any) => {
    switch (field.type) {
      case "text":
      case "email":
      case "password":
        return "";
      case "date":
        return "";
      case "number":
        return ""; // To avoid uncontrolled state, keep empty string (formik will handle conversion)
      case "dropdown":
        return "";
      default:
        return "";
    }
  };

  const initialValues =
    schema?.fields.reduce((acc: Record<string, any>, field) => {
      acc[field.name] = getInitialValueForField(field);
      return acc;
    }, {}) || {};

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true, // This allows Formik to reinitialize when initialValues change
    onSubmit: async (values) => {
      try {
        const result = await onSubmit(values);
        if (result.success) {
          formik.resetForm();
          setFormErrors({});
        } else {
          setFormErrors(result.errors || {});
        }
      } catch (error) {
        // Handle form submission errors silently
      }
    },
  });

  const handleReset = () => {
    formik.resetForm();
    setFormErrors({});
    if (onReset) onReset();
  };

  if (!schema) {
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="textSecondary">
          No form available. Please upload a JSON file to create a form.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        {schema.title}
      </Typography>

      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          {schema.fields.map((field) => (
            <Grid item xs={12} sm={6} key={field.name}>
              <FieldRenderer
                field={field}
                formik={formik}
                formErrors={formErrors}
              />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Submitting..." : "Submit Form"}
          </Button>

          <Button
            type="button"
            variant="outlined"
            color="secondary"
            size="large"
            onClick={handleReset}
          >
            Reset
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default DynamicForm;
