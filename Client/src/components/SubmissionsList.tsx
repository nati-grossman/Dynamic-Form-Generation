/**
 * SubmissionsList Component - Displays submitted forms
 *
 * This component provides:
 * - List of submissions
 * - Delete all submissions
 * - Loading state
 */

import React, { memo } from "react";
import {
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Grid,
  IconButton,
  Chip,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { SubmissionsListProps } from "../types/typesExports";
import { useAppContext } from "../store/storeExports";

const SubmissionsList: React.FC<SubmissionsListProps> = ({
  submissions,
  onDeleteAll,
  loading,
}) => {
  const { schema } = useAppContext();

  const formatDate = (dateString: string) => {
    if (!dateString) return "---";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "---";
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderFieldValue = (
    value: any,
    fieldName?: string,
    submissionMapping?: any
  ) => {
    if (value === null || value === undefined || value === "") {
      return (
        <span style={{ color: "#999", fontStyle: "italic" }}>Not entered</span>
      );
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    // For dropdown fields, try to get the label from saved submission data first
    if (fieldName && submissionMapping?.selected_options_labels?.[fieldName]) {
      const savedLabel = submissionMapping.selected_options_labels[fieldName];
      if (Array.isArray(savedLabel)) {
        return savedLabel.join(", "); // Multiple selection
      }
      return savedLabel; // Single selection
    }

    // Fallback: Check current schema for dropdown field labels
    if (fieldName && schema?.fields) {
      const field = schema.fields.find((f: any) => f.name === fieldName);
      if (field && field.type === "dropdown" && field.options) {
        if (Array.isArray(value)) {
          // Multiple selection
          const labels = value.map((v: any) => {
            const option = field.options?.find((opt: any) => opt.value === v);
            return option ? option.label : v;
          });
          return labels.join(", ");
        } else {
          // Single selection
          const option = field.options?.find((opt: any) => opt.value === value);
          if (option) {
            return option.label;
          }
        }
      }
    }

    return String(value);
  };

  const getLabelForField = (name: string, submissionMapping?: any) => {
    // Handle new format with nested structure
    if (submissionMapping?.fields_mapping) {
      if (submissionMapping.fields_mapping[name]) {
        return submissionMapping.fields_mapping[name];
      }
    }
    // Handle old format (direct object or array)
    else if (submissionMapping) {
      if (Array.isArray(submissionMapping)) {
        const found = submissionMapping.find((f) => f.name === name);
        if (found) return found.label;
      } else if (
        typeof submissionMapping === "object" &&
        submissionMapping[name]
      ) {
        return submissionMapping[name];
      }
    }
    return schema?.fields.find((f: any) => f.name === name)?.label || name;
  };

  const renderSubmissionData = (
    data: Record<string, any>,
    submissionMapping?: any
  ) => (
    <Grid container spacing={1}>
      {Object.entries(data).map(([key, value]) => (
        <Grid item xs={12} sm={6} key={key}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography
              variant="subtitle2"
              color="primary"
              sx={{ minWidth: 100 }}
            >
              {getLabelForField(key, submissionMapping)}:
            </Typography>
            <Typography variant="body2" sx={{ ml: 1 }}>
              {renderFieldValue(value, key, submissionMapping)}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );

  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (!submissions.length) {
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">No forms submitted</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">
          Submitted Forms ({submissions.length})
        </Typography>
        <Tooltip title="Delete all submissions">
          <IconButton onClick={onDeleteAll} color="error">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
      {submissions.map((submission, idx) => {
        const dataObj =
          typeof submission.data === "string"
            ? JSON.parse(submission.data)
            : submission.data;
        return (
          <Accordion key={submission.id} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Chip
                    label={formatDate(submission.submitted_at)}
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="subtitle1" component="span">
                    {submission.form_title || `Submission #${idx + 1}`}
                  </Typography>
                </Box>
                <Typography variant="caption" color="textSecondary">
                  #{submission.id}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {renderSubmissionData(
                dataObj,
                (submission as any).fields_mapping
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Paper>
  );
};

export default memo(SubmissionsList);
