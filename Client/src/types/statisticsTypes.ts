/**
 * Statistics Types - Types related to form statistics
 *
 * This file contains types for statistics data and reporting.
 */

// Statistics Types
export interface FieldStat {
  label: string;
}

export interface FormStat {
  title: string;
  count: number;
  fields: FieldStat[];
}

export interface FormStatistics {
  total_submissions: number;
  total_forms: number;
  forms: FormStat[];
}
