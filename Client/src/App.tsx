/**
 * App Component - Main application component
 *
 * This component serves as the main entry point and orchestrates:
 * - Global state management
 * - Service integration
 * - Component composition
 * - Data flow
 */

import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Box, Button } from "@mui/material";
import { Assessment as AssessmentIcon } from "@mui/icons-material";

// Context and Services
import { AppProvider, useAppContext } from "./store/storeExports";
import { submitForm } from "./services/formService";
import { useInitialData } from "./hooks/useInitialData";
import { useSubmissions } from "./hooks/useSubmissions";

// Components
import FileUpload from "./components/FileUpload";
import DynamicForm from "./components/DynamicForm/DynamicForm";
import SubmissionsList from "./components/SubmissionsList";
import MessageDisplay from "./components/MessageDisplay";
import StatisticsDialog from "./components/StatisticsDialog";

// Main App Content
const AppContent: React.FC = () => {
  const { schema, loading, setSchema, displayMessage } = useAppContext();

  const [statisticsOpen, setStatisticsOpen] = useState(false);

  const { loadInitialData } = useInitialData();
  const { submissions, refreshSubmissions, handleDeleteAllSubmissions } =
    useSubmissions();

  // Load initial data on component mount
  useEffect(() => {
    loadInitialData();
    refreshSubmissions(); // Load submissions separately
  }, [loadInitialData, refreshSubmissions]);

  const handleFormSubmit = async (formData: Record<string, any>) => {
    try {
      const result = await submitForm({
        form_id: schema?.title || "default",
        data: formData,
      });

      if (result.success) {
        displayMessage(result.message, "success");
        // Refresh submissions after successful submit
        await refreshSubmissions(true); // Force refresh
        return result;
      } else {
        displayMessage(result.message, "error");
        return result;
      }
    } catch (error: any) {
      displayMessage(error.message, "error");
      return { success: false, errors: {}, message: error.message || "Error" };
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          align="center"
          sx={{ flex: 1 }}
        >
          Dynamic Form System
        </Typography>

        <Button
          variant="outlined"
          startIcon={<AssessmentIcon />}
          onClick={() => setStatisticsOpen(true)}
          sx={{
            minWidth: "auto",
            "& .MuiButton-startIcon": { marginRight: 1 },
          }}
        >
          Statistics
        </Button>
      </Box>

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

      {/* Statistics Dialog */}
      <StatisticsDialog
        open={statisticsOpen}
        onClose={() => setStatisticsOpen(false)}
      />
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
