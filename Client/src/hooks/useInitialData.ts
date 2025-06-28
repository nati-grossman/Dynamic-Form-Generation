/**
 * Custom hook for loading initial application data
 */

import { useCallback } from "react";
import { useAppContext } from "../store";
import { getCurrentSchema } from "../services/formService";
import { getSubmissions } from "../services/submissionService";

export const useInitialData = () => {
  const { setSchema, setSubmissions, setLoading, displayMessage } =
    useAppContext();

  const loadInitialData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);

      // Load current schema and submissions in parallel
      const [currentSchema, submissionsData] = await Promise.allSettled([
        getCurrentSchema(),
        getSubmissions(),
      ]);

      // Handle schema
      if (currentSchema.status === "fulfilled") {
        setSchema(currentSchema.value);
      }

      // Handle submissions
      if (submissionsData.status === "fulfilled") {
        setSubmissions(submissionsData.value);
      } else {
        displayMessage("שגיאה בטעינת הטפסים שהוגשו", "error");
      }
    } catch (error: any) {
      displayMessage("שגיאה בטעינת הנתונים", "error");
    } finally {
      setLoading(false);
    }
  }, [setLoading, setSchema, setSubmissions, displayMessage]);

  return { loadInitialData };
};
