/**
 * App Component - Main application component
 *
 * This component serves as the main entry point and orchestrates:
 * - Global state management
 * - Service integration
 * - Component composition
 * - Data flow
 */

import React, { useEffect } from "react";
import { Container, Typography, Grid } from "@mui/material";

// Context and Services
import { AppProvider, useAppContext } from "./store";
import { submitForm } from "./services/formService";
import {
  getSubmissions,
  deleteAllSubmissions,
} from "./services/submissionService";
import { useInitialData } from "./hooks/useInitialData";

// Components
import FileUpload from "./components/FileUpload";
import DynamicForm from "./components/DynamicForm";
import SubmissionsList from "./components/SubmissionsList";
import MessageDisplay from "./components/MessageDisplay";

// Main App Content
const AppContent: React.FC = () => {
  const {
    schema,
    submissions,
    loading,
    setSchema,
    setSubmissions,
    setLoading,
    displayMessage,
    clearSubmissions,
  } = useAppContext();

  const { loadInitialData } = useInitialData();

  // Load initial data on component mount
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleFormSubmit = async (formData: Record<string, any>) => {
    try {
      const result = await submitForm({
        form_id: schema?.title || "default",
        data: formData,
      });

      if (result.success) {
        displayMessage(result.message, "success");
        // Reload submissions
        const updatedSubmissions = await getSubmissions();
        setSubmissions(updatedSubmissions);
        return result;
      } else {
        displayMessage(result.message, "error");
        return result;
      }
    } catch (error: any) {
      displayMessage(error.message, "error");
      return { success: false, errors: {}, message: error.message || "שגיאה" };
    }
  };

  const handleDeleteAllSubmissions = async (): Promise<void> => {
    try {
      setLoading(true);
      await deleteAllSubmissions();
      clearSubmissions();
      displayMessage("כל הטפסים נמחקו בהצלחה", "success");
    } catch (error: any) {
      displayMessage(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSchemaUploaded = async (newSchema: any): Promise<void> => {
    // Use the schema from upload response immediately for better UX
    setSchema(newSchema);

    // Force a small delay to ensure state update is processed
    await new Promise((resolve) => setTimeout(resolve, 100));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        align="center"
        sx={{ mb: 4 }}
      >
        מערכת טפסים דינמית
      </Typography>

      {/* File Upload Section */}
      <FileUpload onSchemaUploaded={handleSchemaUploaded} />

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Form Section */}
        <Grid item xs={12} md={6}>
          <DynamicForm
            schema={schema}
            onSubmit={handleFormSubmit}
            onReset={() => {}}
          />
        </Grid>

        {/* Submissions Section */}
        <Grid item xs={12} md={6}>
          <SubmissionsList
            submissions={submissions}
            onDeleteAll={handleDeleteAllSubmissions}
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Message Display */}
      <MessageDisplay />
    </Container>
  );
};

// App with Provider
const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
