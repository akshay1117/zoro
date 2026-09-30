import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DesktopSidebar } from './components/layout/DesktopSidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { HeaderRibbon } from './components/layout/HeaderRibbon';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { TasksPage } from './pages/TasksPage';
import { HabitsPage } from './pages/HabitsPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { FitnessPage } from './pages/FitnessPage';
import { TradingPage } from './pages/TradingPage';
import { CyberPage } from './pages/CyberPage';
import { NotesPage } from './pages/NotesPage';
import { GoalsPage } from './pages/GoalsPage';
import { useAuthStore, api } from './store/useAuthStore';

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-full text-[#94949E]">
    <h2 className="font-display text-2xl">{title} coming soon...</h2>
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, setUser, logout } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/auth/me')
        .then(res => setUser(res.data))
        .catch(() => logout());
    } else {
      useAuthStore.setState({ isLoading: false });
    }
  }, [isAuthenticated, setUser, logout]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <div className="text-violet-500 text-lg">Initializing...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

import { ZoroCommandMenu } from './components/modules/orb/ZoroCommandMenu';

const AuthenticatedLayout = () => {
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsCommandMenuOpen(true);
    document.addEventListener('open-zoro-command', handleOpen);
    return () => document.removeEventListener('open-zoro-command', handleOpen);
  }, []);

  return (
    <div className="min-h-screen bg-base flex">
      <DesktopSidebar />
      <div className="flex-1 flex flex-col lg:pl-64 min-h-screen">
        <HeaderRibbon />
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/habits" element={<HabitsPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/fitness" element={<FitnessPage />} />
            <Route path="/trading" element={<TradingPage />} />
            <Route path="/cyber" element={<CyberPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/goals" element={<GoalsPage />} />
          </Routes>
        </main>
        <MobileBottomNav />
      </div>
      <ZoroCommandMenu isOpen={isCommandMenuOpen} onClose={() => setIsCommandMenuOpen(false)} />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <AuthenticatedLayout />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
