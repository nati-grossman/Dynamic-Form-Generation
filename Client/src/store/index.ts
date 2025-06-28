/**
 * Store Index - Centralized exports for the store
 *
 * This file provides convenient imports for all store-related modules.
 */

// Main exports
export { AppProvider } from "./context";
export { useAppContext, useAppState, useAppActions } from "./hooks";

// Actions (for advanced usage)
export * from "./actions";

// Reducer (for testing or advanced usage)
export { appReducer, initialState } from "./reducer";

// Types
export type { AppContextType } from "./context";
