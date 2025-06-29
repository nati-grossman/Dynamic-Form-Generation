/**
 * Custom hook for managing submissions with optimizations
 */

import { useCallback, useRef } from "react";
import { useAppContext } from "../store/storeExports";
import {
  getSubmissions,
  deleteAllSubmissions,
} from "../services/submissionService";

export const useSubmissions = () => {
  const {
    submissions,
    setSubmissions,
    setLoading,
    displayMessage,
    clearSubmissions,
  } = useAppContext();

  // Cache to prevent unnecessary API calls
  const lastFetchTime = useRef<number>(0);
  const CACHE_DURATION = 5000; // 5 seconds cache

  const refreshSubmissions = useCallback(
    async (force: boolean = false): Promise<void> => {
      const now = Date.now();

      // Skip if recent fetch and not forced
      if (!force && now - lastFetchTime.current < CACHE_DURATION) {
        return;
      }

      try {
        setLoading(true);
        const updatedSubmissions = await getSubmissions();
        setSubmissions(updatedSubmissions);
        lastFetchTime.current = now;
      } catch (error: any) {
        displayMessage("Error loading submitted forms", "error");
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setSubmissions, displayMessage]
  );

  const handleDeleteAllSubmissions = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      await deleteAllSubmissions();
      clearSubmissions();
      displayMessage("All forms deleted successfully", "success");
      lastFetchTime.current = 0; // Reset cache
    } catch (error: any) {
      displayMessage(error.message, "error");
    } finally {
      setLoading(false);
    }
  }, [setLoading, clearSubmissions, displayMessage]);

  return {
    submissions,
    refreshSubmissions,
    handleDeleteAllSubmissions,
  };
};
