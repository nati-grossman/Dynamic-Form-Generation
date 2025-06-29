/**
 * Custom hook for loading initial application data
 */

import { useCallback } from "react";
import { useAppContext } from "../store/storeExports";
import { getCurrentSchema } from "../services/formService";

export const useInitialData = () => {
  const { setSchema, setLoading, displayMessage } = useAppContext();

  const loadInitialData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);

      // Load current schema only (submissions will be loaded by useSubmissions)
      const currentSchema = await getCurrentSchema();
      setSchema(currentSchema);
    } catch (error: any) {
      // Schema loading is optional - app can work without it
    } finally {
      setLoading(false);
    }
  }, [setLoading, setSchema, displayMessage]);

  return { loadInitialData };
};
