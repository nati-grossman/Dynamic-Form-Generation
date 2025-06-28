/**
 * SubmissionsList Component - Displays submitted forms
 *
 * This component provides:
 * - List of submissions
 * - Delete all submissions
 * - Loading state
 */

import React from "react";
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
import { SubmissionsListProps } from "../types";
import { useAppState } from "../store";

const SubmissionsList: React.FC<SubmissionsListProps> = ({
  submissions,
  onDeleteAll,
  loading,
}) => {
  const { schema } = useAppState();

  const formatDate = (dateString: string) => {
    if (!dateString) return "---";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "---";
    return date.toLocaleString("he-IL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderFieldValue = (value: any) => {
    if (value === null || value === undefined || value === "") {
      return (
        <span style={{ color: "#999", fontStyle: "italic" }}>לא הוזן</span>
      );
    }
    if (typeof value === "boolean") {
      return value ? "כן" : "לא";
    }
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return String(value);
  };

  const getLabelForField = (
    name: string,
    fieldsMapping?: { name: string; label: string }[]
  ) => {
    if (fieldsMapping) {
      const found = fieldsMapping.find((f) => f.name === name);
      if (found) return found.label;
    }
    return schema?.fields.find((f) => f.name === name)?.label || name;
  };

  const renderSubmissionData = (
    data: Record<string, any>,
    fieldsMapping?: { name: string; label: string }[]
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
              {getLabelForField(key, fieldsMapping)}:
            </Typography>
            <Typography variant="body2" sx={{ ml: 1 }}>
              {renderFieldValue(value)}
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
        <Typography variant="h6">לא הוגשו טפסים</Typography>
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
          טפסים שהוגשו ({submissions.length})
        </Typography>
        <Tooltip title="מחק את כל ההגשות">
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
                    {submission.form_title || `הגשה #${idx + 1}`}
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

export default SubmissionsList;
