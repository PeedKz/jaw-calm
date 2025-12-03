import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./contexts/AppContext";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Progress from "./pages/Progress";
import Rewards from "./pages/Rewards";
import Exercises from "./pages/Exercises";
import ExerciseDetail from "./pages/ExerciseDetail";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { useRelaxationPopupTrigger } from "./hooks/useRelaxationPopupTrigger";
import { useDailyGoalCelebration } from "./hooks/useDailyGoalCelebration";
import { DailyGoalAnimation } from "./components/celebrations/DailyGoalAnimation";
import { RelaxationReminderPopup } from "./components/notifications/RelaxationReminderPopup";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isOnboardingCompleted, language } = useApp();
  
  // Initialize relaxation popup trigger system
  const { isPopupOpen, handleDismiss, handleStartExercise } = useRelaxationPopupTrigger();
  
  // Handle daily goal celebration
  const { showCelebration, dismissCelebration } = useDailyGoalCelebration();

  return (
    <>
      <Routes>
        {!isOnboardingCompleted ? (
          <>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="*" element={<Navigate to="/onboarding" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/exercises/:id" element={<ExerciseDetail />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/onboarding" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </>
        )}
      </Routes>
      
      {/* Relaxation Reminder Popup */}
      {isOnboardingCompleted && (
        <RelaxationReminderPopup
          isOpen={isPopupOpen}
          onDismiss={handleDismiss}
          onStartExercise={handleStartExercise}
        />
      )}
      
      {/* Daily Goal Celebration Modal */}
      {isOnboardingCompleted && (
        <DailyGoalAnimation 
          show={showCelebration} 
          onDismiss={dismissCelebration}
          language={language}
        />
      )}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
