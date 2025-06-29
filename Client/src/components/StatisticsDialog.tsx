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
import { FormStatistics } from "../types";
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
      setError(err.message || "שגיאה בטעינת הסטטיסטיקות");
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
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <AssessmentIcon />
        סטטיסטיקות הטפסים
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
                    סך הכל הגשות
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ flex: 1 }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h4" color="secondary">
                    {statistics.total_forms}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    סוגי טפסים שונים
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Forms Statistics */}
            {statistics.forms.length === 0 ? (
              <Alert severity="info">אין עדיין הגשות במערכת</Alert>
            ) : (
              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <BarChartIcon />
                  פירוט לפי טפסים
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
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <DescriptionIcon />
                          {form.title}
                        </Typography>
                        <Chip
                          label={`${form.count} הגשות`}
                          color="primary"
                          variant="outlined"
                        />
                      </Box>

                      {form.fields.length > 0 && (
                        <>
                          <Divider sx={{ mb: 2 }} />
                          <Typography variant="subtitle2" gutterBottom>
                            שדות בטופס:
                          </Typography>
                          <List dense>
                            {form.fields.map((field, fieldIndex) => (
                              <ListItem key={fieldIndex} sx={{ py: 0.5 }}>
                                <ListItemText
                                  primary={field.label}
                                  secondary={field.name}
                                  primaryTypographyProps={{ variant: "body2" }}
                                  secondaryTypographyProps={{
                                    variant: "caption",
                                  }}
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
        <Button onClick={handleClose}>סגור</Button>
        <Button onClick={loadStatistics} disabled={loading}>
          רענן
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatisticsDialog;
