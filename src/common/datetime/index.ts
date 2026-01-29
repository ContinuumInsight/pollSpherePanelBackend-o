/**
 * Get current timestamp in milliseconds
 */
export const getCurrentTimestamp = (): number => {
  return Date.now();
};

/**
 * Get current date
 */
export const getCurrentDate = (): Date => {
  return new Date();
};

/**
 * Add days to a date
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Add hours to a date
 */
export const addHours = (date: Date, hours: number): Date => {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
};

/**
 * Check if date is expired
 */
export const isExpired = (expiryDate: Date): boolean => {
  return new Date() > expiryDate;
};

/**
 * Format date to ISO string
 */
export const formatToISO = (date: Date): string => {
  return date.toISOString();
};

export default {
  getCurrentTimestamp,
  getCurrentDate,
  addDays,
  addHours,
  isExpired,
  formatToISO,
};
