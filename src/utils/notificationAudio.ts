// Soft notification sound as base64
const NOTIFICATION_SOUND_BASE64 = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBi6H0fPTgjMGHm7A7+OZUQ0PVqzn7a1aFw5CnePyu28gBjGM0/PTgjMGHm3A7+OZUg0PVqzn7a1aFw5CnePyu28gBjGM0/PTgjMGHm3A7+OZUg0PVqzn7a1aFw5CnePyu28gBjGM0/PTgjMGHm3A7+OZUg0PVqzn7a1aFw5CnePyu28gBjGM0/PTgjMGHm3A7+OZUg0PVqzn7a1aFw5CnePyu28gBjGM0/PTgjMGHm3A7+OZUg0PVqzn7a1aFw5CnePyu28gBjGM0/PTgjMGHm3A7+OZUg0PVqzn7a1aFw5CnePyu28gBjGM0/PTgjMGHm3A7+OZUg0PVqzn7a1aFw5CnePyu28gBjGM0/PTgjMGHm3A7+OZUg0PVqzn7a1aFw5CnePyu28gBjGM0/PTgjMGHm3A7+OZUg==';

let audioInstance: HTMLAudioElement | null = null;

export const playNotificationSound = (): Promise<void> => {
  return new Promise((resolve) => {
    try {
      // Reuse or create audio instance
      if (!audioInstance) {
        audioInstance = new Audio(NOTIFICATION_SOUND_BASE64);
        audioInstance.volume = 0.5;
      }
      
      audioInstance.currentTime = 0;
      audioInstance.play()
        .then(() => resolve())
        .catch(() => resolve()); // Silent fail
    } catch {
      resolve(); // Silent fail
    }
  });
};

export const stopNotificationSound = (): void => {
  if (audioInstance) {
    audioInstance.pause();
    audioInstance.currentTime = 0;
  }
};
