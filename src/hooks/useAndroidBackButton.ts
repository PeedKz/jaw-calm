import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App } from '@capacitor/app';

export const useAndroidBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleBackButton = App.addListener('backButton', ({ canGoBack }) => {
      // If we're on the home page, exit the app
      if (location.pathname === '/' || location.pathname === '/dashboard') {
        App.exitApp();
      } else if (canGoBack) {
        // Navigate back in history
        navigate(-1);
      } else {
        // Fallback to home
        navigate('/');
      }
    });

    return () => {
      handleBackButton.then(listener => listener.remove());
    };
  }, [navigate, location.pathname]);
};
