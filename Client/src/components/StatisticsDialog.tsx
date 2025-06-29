/**
 * Statistics Dialog Component
 *
 * Displays form submission statistics in a modal dialog
 */

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import {
  BarChart as BarChartIcon,
  Assessment as AssessmentIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { FormStatistics } from "../types/appTypes";
import { getStatistics } from "../services/submissionService";

interface StatisticsDialogProps {
  open: boolean;
  onClose: () => void;
}

const StatisticsDialog: React.FC<StatisticsDialogProps> = ({
  open,
  onClose,
}) => {
  const [statistics, setStatistics] = useState<FormStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const stats = await getStatistics();
      setStatistics(stats);
    } catch (err: any) {
      setError(err.message || "Error loading statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadStatistics();
    }
  }, [open]);

  const handleClose = () => {
    setStatistics(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: "400px" },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <AssessmentIcon />
        Form Statistics
      </DialogTitle>

      <DialogContent>
        {loading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
          >
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {statistics && !loading && (
          <Box>
            {/* Summary Cards */}
            <Box display="flex" gap={2} mb={3}>
              <Card sx={{ flex: 1 }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h4" color="primary">
                    {statistics.total_submissions}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Submissions
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ flex: 1 }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h4" color="secondary">
                    {statistics.total_forms}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Different Form Types
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Forms Statistics */}
            {statistics.forms.length === 0 ? (
              <Alert severity="info">No submissions in the system yet</Alert>
            ) : (
              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 2 }}
                >
                  <BarChartIcon />
                  Breakdown by Forms
                </Typography>

                {statistics.forms.map((form, index) => (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                      >
                        <Typography
                          variant="h6"
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <DescriptionIcon />
                          {form.title}
                        </Typography>
                        <Chip
                          label={`${form.count} submissions`}
                          color="primary"
                          variant="outlined"
                        />
                      </Box>

                      {form.fields.length > 0 && (
                        <>
                          <Divider sx={{ mb: 2 }} />
                          <Typography variant="subtitle2" gutterBottom>
                            Form Fields:
                          </Typography>
                          <List dense>
                            {form.fields.map((field, fieldIndex) => (
                              <ListItem key={fieldIndex} sx={{ py: 0.5 }}>
                                <ListItemText
                                  primary={field.label}
                                  primaryTypographyProps={{ variant: "body2" }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={loadStatistics} disabled={loading}>
          Refresh
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatisticsDialog;
