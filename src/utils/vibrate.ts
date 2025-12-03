/**
 * Triggers device vibration with fallback
 * @param pattern - Vibration pattern in milliseconds (single value or array)
 */
export const triggerVibration = (pattern: number | number[] = 300): boolean => {
  try {
    if ('vibrate' in navigator) {
      return navigator.vibrate(pattern);
    }
    return false;
  } catch {
    return false;
  }
};

/**
 * Stops any ongoing vibration
 */
export const stopVibration = (): void => {
  try {
    if ('vibrate' in navigator) {
      navigator.vibrate(0);
    }
  } catch {
    // Silent fail
  }
};

/**
 * Check if vibration is supported
 */
export const isVibrationSupported = (): boolean => {
  return 'vibrate' in navigator;
};
