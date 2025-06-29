/**
 * Store Reducer - State management logic
 *
 * This file contains the reducer function that handles all state updates
 * based on dispatched actions.
 */

import { AppState, AppAction } from "@/types/typesExports";
import { ACTIONS } from "./actions";

// Initial state
export const initialState: AppState = {
  // Form data
  schema: null,
  submissions: [],

  // UI state
  loading: false,
  message: "",
  messageType: "success",
  showMessage: false,

  // Form state
  formErrors: {},
  isFormValid: false,
};

/**
 * Main reducer function
 * @param state - Current application state
 * @param action - Action to process
 * @returns New state
 */
export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case ACTIONS.SET_SCHEMA:
      return {
        ...state,
        schema: action.payload as any,
      };

    case ACTIONS.CLEAR_SCHEMA:
      return {
        ...state,
        schema: null,
      };

    case ACTIONS.SET_SUBMISSIONS:
      return {
        ...state,
        submissions: action.payload as any,
      };

    case ACTIONS.ADD_SUBMISSION:
      return {
        ...state,
        submissions: [...state.submissions, action.payload as any],
      };

    case ACTIONS.CLEAR_SUBMISSIONS:
      return {
        ...state,
        submissions: [],
      };

    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload as boolean,
      };

    case ACTIONS.SHOW_MESSAGE:
      const messagePayload = action.payload as { message: string; type?: any };
      return {
        ...state,
        message: messagePayload.message,
        messageType: messagePayload.type || "success",
        showMessage: true,
      };

    case ACTIONS.HIDE_MESSAGE:
      return {
        ...state,
        showMessage: false,
      };

    case ACTIONS.SET_FORM_ERRORS:
      return {
        ...state,
        formErrors: action.payload as Record<string, string[]>,
        isFormValid: false,
      };

    case ACTIONS.CLEAR_FORM_ERRORS:
      return {
        ...state,
        formErrors: {},
        isFormValid: true,
      };

    case ACTIONS.SET_FORM_VALID:
      return {
        ...state,
        isFormValid: action.payload as boolean,
      };

    default:
      return state;
  }
};
