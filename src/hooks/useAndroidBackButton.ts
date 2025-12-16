import { useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { toast } from 'sonner';

// Global state for modal management
let activeModalCloseHandler: (() => void) | null = null;

export const registerModalCloseHandler = (handler: () => void) => {
  activeModalCloseHandler = handler;
};

export const unregisterModalCloseHandler = () => {
  activeModalCloseHandler = null;
};

export const useAndroidBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lastBackPressRef = useRef<number>(0);
  const exitToastShownRef = useRef<boolean>(false);

  const handleBackButton = useCallback(() => {
    const currentTime = Date.now();
    const isHomePage = location.pathname === '/' || location.pathname === '/dashboard';

    // First, check if there's an active modal to close
    if (activeModalCloseHandler) {
      activeModalCloseHandler();
      return;
    }

    // If on home page, implement double-tap to exit
    if (isHomePage) {
      const timeSinceLastPress = currentTime - lastBackPressRef.current;
      
      if (timeSinceLastPress < 2000 && exitToastShownRef.current) {
        // Second press within 2 seconds - exit app
        App.exitApp();
      } else {
        // First press - show toast
        lastBackPressRef.current = currentTime;
        exitToastShownRef.current = true;
        toast.info('Pressione voltar novamente para sair', {
          duration: 2000,
        });
        
        // Reset the flag after 2 seconds
        setTimeout(() => {
          exitToastShownRef.current = false;
        }, 2000);
      }
    } else {
      // On other pages, navigate back
      navigate(-1);
    }
  }, [navigate, location.pathname]);

  useEffect(() => {
    // Only run on native platforms
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const backButtonListener = App.addListener('backButton', ({ canGoBack }) => {
      handleBackButton();
    });

    return () => {
      backButtonListener.then(listener => listener.remove());
    };
  }, [handleBackButton]);
};

// Hook for components with modals to register close handlers
export const useModalBackHandler = (isOpen: boolean, onClose: () => void) => {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    if (isOpen) {
      registerModalCloseHandler(onClose);
    } else {
      unregisterModalCloseHandler();
    }

    return () => {
      if (isOpen) {
        unregisterModalCloseHandler();
      }
    };
  }, [isOpen, onClose]);
};
