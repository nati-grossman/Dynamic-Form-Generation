/**
 * Store Actions - Action creators for the app store
 *
 * This file contains all action creators that can be dispatched
 * to update the application state.
 */

import { FormSchema, SubmissionDB, MessageType } from "@/types/typesExports";

// Action types
export const ACTIONS = {
  // Schema actions
  SET_SCHEMA: "SET_SCHEMA",
  CLEAR_SCHEMA: "CLEAR_SCHEMA",

  // Submissions actions
  SET_SUBMISSIONS: "SET_SUBMISSIONS",
  ADD_SUBMISSION: "ADD_SUBMISSION",
  CLEAR_SUBMISSIONS: "CLEAR_SUBMISSIONS",

  // Loading actions
  SET_LOADING: "SET_LOADING",

  // Message actions
  SHOW_MESSAGE: "SHOW_MESSAGE",
  HIDE_MESSAGE: "HIDE_MESSAGE",

  // Form actions
  SET_FORM_ERRORS: "SET_FORM_ERRORS",
  CLEAR_FORM_ERRORS: "CLEAR_FORM_ERRORS",
  SET_FORM_VALID: "SET_FORM_VALID",
} as const;

// Schema actions
export const setSchema = (schema: FormSchema) => ({
  type: ACTIONS.SET_SCHEMA,
  payload: schema,
});

export const clearSchema = () => ({
  type: ACTIONS.CLEAR_SCHEMA,
});

// Submissions actions
export const setSubmissions = (submissions: SubmissionDB[]) => ({
  type: ACTIONS.SET_SUBMISSIONS,
  payload: submissions,
});

export const addSubmission = (submission: SubmissionDB) => ({
  type: ACTIONS.ADD_SUBMISSION,
  payload: submission,
});

export const clearSubmissions = () => ({
  type: ACTIONS.CLEAR_SUBMISSIONS,
});

// Loading actions
export const setLoading = (loading: boolean) => ({
  type: ACTIONS.SET_LOADING,
  payload: loading,
});

// Message actions
export const showMessage = (
  message: string,
  type: MessageType = "success"
) => ({
  type: ACTIONS.SHOW_MESSAGE,
  payload: { message, type },
});

export const hideMessage = () => ({
  type: ACTIONS.HIDE_MESSAGE,
});

// Form actions
export const setFormErrors = (errors: Record<string, string[]>) => ({
  type: ACTIONS.SET_FORM_ERRORS,
  payload: errors,
});

export const clearFormErrors = () => ({
  type: ACTIONS.CLEAR_FORM_ERRORS,
});

export const setFormValid = (isValid: boolean) => ({
  type: ACTIONS.SET_FORM_VALID,
  payload: isValid,
});
