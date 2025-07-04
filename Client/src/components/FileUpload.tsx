/**
 * FileUpload Component - Handles file upload functionality
 *
 * This component provides:
 * - Download example file button
 * - Upload JSON schema file
 * - Loading states
 * - Error handling
 */

import React from "react";
import {
  Paper,
  Typography,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";

import { useAppContext } from "../store/storeExports";
import { downloadExample, uploadSchema } from "../services/formService";

interface FileUploadProps {
  onSchemaUploaded?: (schema: any) => Promise<void>;
}

const FileUpload: React.FC<FileUploadProps> = ({ onSchemaUploaded }) => {
  const { loading, setLoading, displayMessage, setSchema } = useAppContext();

  const handleDownloadExample = async (): Promise<void> => {
    try {
      setLoading(true);
      await downloadExample();
      displayMessage("Example file downloaded successfully", "success");
    } catch (error: any) {
      displayMessage(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const result = await uploadSchema(file);
      displayMessage(result.message || "File uploaded successfully", "success");

      // Call parent callback if provided, otherwise set schema directly
      if (onSchemaUploaded && result.schema) {
        await onSchemaUploaded(result.schema);
      } else if (result.schema) {
        setSchema(result.schema);
      }
    } catch (error: any) {
      displayMessage(error.message, "error");
    } finally {
      setLoading(false);
      // Reset file input
      event.target.value = "";
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        JSON File Upload
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadExample}
            disabled={loading}
            sx={{ "& .MuiButton-startIcon": { marginRight: 1 } }}
          >
            Download Example File
          </Button>
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadIcon />}
            disabled={loading}
            sx={{ "& .MuiButton-startIcon": { marginRight: 1 } }}
          >
            Upload JSON File
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
          </Button>
        </Grid>

        {loading && (
          <Grid item>
            <CircularProgress size={24} />
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default FileUpload;
