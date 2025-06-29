/**
 * App Context - React Context for state management
 *
 * This file provides the React Context and Provider component
 * that wraps the application with state management capabilities.
 */

import React, {
  createContext,
  useReducer,
  useCallback,
  ReactNode,
} from "react";
import { FormSchema, SubmissionDB, MessageType } from "@/types/appTypes";
import { initialState, appReducer } from "./reducer";
import * as actions from "./actions";

// Context interface
export interface AppContextType {
  // State
  schema: FormSchema | null;
  submissions: SubmissionDB[];
  loading: boolean;
  message: string;
  messageType: MessageType;
  showMessage: boolean;
  formErrors: Record<string, string[]>;
  isFormValid: boolean;

  // Actions
  setSchema: (schema: FormSchema) => void;
  clearSchema: () => void;
  setSubmissions: (submissions: SubmissionDB[]) => void;
  addSubmission: (submission: SubmissionDB) => void;
  clearSubmissions: () => void;
  setLoading: (loading: boolean) => void;
  displayMessage: (message: string, type?: MessageType) => void;
  hideMessage: () => void;
  setFormErrors: (errors: Record<string, string[]>) => void;
  clearFormErrors: () => void;
  setFormValid: (isValid: boolean) => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Schema actions
  const setSchema = useCallback((schema: FormSchema) => {
    dispatch(actions.setSchema(schema));
  }, []);

  const clearSchema = useCallback(() => {
    dispatch(actions.clearSchema());
  }, []);

  // Submissions actions
  const setSubmissions = useCallback((submissions: SubmissionDB[]) => {
    dispatch(actions.setSubmissions(submissions));
  }, []);

  const addSubmission = useCallback((submission: SubmissionDB) => {
    dispatch(actions.addSubmission(submission));
  }, []);

  const clearSubmissions = useCallback(() => {
    dispatch(actions.clearSubmissions());
  }, []);

  // Loading actions
  const setLoading = useCallback((loading: boolean) => {
    dispatch(actions.setLoading(loading));
  }, []);

  // Message actions
  const displayMessage = useCallback(
    (message: string, type: MessageType = "success") => {
      dispatch(actions.showMessage(message, type));
    },
    []
  );

  const hideMessage = useCallback(() => {
    dispatch(actions.hideMessage());
  }, []);

  // Form actions
  const setFormErrors = useCallback((errors: Record<string, string[]>) => {
    dispatch(actions.setFormErrors(errors));
  }, []);

  const clearFormErrors = useCallback(() => {
    dispatch(actions.clearFormErrors());
  }, []);

  const setFormValid = useCallback((isValid: boolean) => {
    dispatch(actions.setFormValid(isValid));
  }, []);

  // Context value
  const value: AppContextType = {
    // State
    ...state,

    // Actions
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

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext };
