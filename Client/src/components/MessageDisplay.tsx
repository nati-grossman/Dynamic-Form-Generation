/**
 * MessageDisplay Component - Handles message/notification display
 *
 * This component provides:
 * - Success/error/warning/info message display
 * - Auto-hide functionality
 * - Consistent styling
 */

import React, { useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";
import { useAppContext } from "../store";

const MessageDisplay: React.FC = () => {
  const { message, messageType, showMessage, hideMessage } = useAppContext();

  // Auto-hide message after 5 seconds
  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        hideMessage();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showMessage, hideMessage]);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ): void => {
    if (reason === "clickaway") {
      return;
    }
    hideMessage();
  };

  return (
    <Snackbar
      open={showMessage}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        severity={messageType}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default MessageDisplay;
