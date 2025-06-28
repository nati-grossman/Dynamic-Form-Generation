/**
 * Store Hooks - Custom hooks for accessing store functionality
 *
 * This file provides custom hooks that make it easy to use the store
 * from any component.
 */

import { useContext } from "react";
import { AppContext, AppContextType } from "./context";

/**
 * Hook to access the app context
 * @returns App context with state and actions
 */
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

/**
 * Hook to access only the state (read-only)
 * @returns Current app state
 */
export const useAppState = () => {
  const {
    schema,
    submissions,
    loading,
    message,
    messageType,
    showMessage,
    formErrors,
    isFormValid,
  } = useAppContext();

  return {
    schema,
    submissions,
    loading,
    message,
    messageType,
    showMessage,
    formErrors,
    isFormValid,
  };
};

/**
 * Hook to access only the actions
 * @returns App actions
 */
export const useAppActions = () => {
  const {
    setSchema,
    clearSchema,
    setSubmissions,
    addSubmission,
    clearSubmissions,
    setLoading,
    displayMessage,
    hideMessage,
    setFormErrors,
    clearFormErrors,
    setFormValid,
  } = useAppContext();

  return {
    setSchema,
    clearSchema,
    setSubmissions,
    addSubmission,
    clearSubmissions,
    setLoading,
    displayMessage,
    hideMessage,
    setFormErrors,
    clearFormErrors,
    setFormValid,
  };
};
