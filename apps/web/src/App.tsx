import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DesktopSidebar } from './components/layout/DesktopSidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { HeaderRibbon } from './components/layout/HeaderRibbon';
import { DashboardPage } from './pages/DashboardPage';

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-full text-[#94949E]">
    <h2 className="font-display text-2xl">{title} coming soon...</h2>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-base flex">
        <DesktopSidebar />
        
        <div className="flex-1 flex flex-col lg:pl-64 min-h-screen">
          <HeaderRibbon />
          
          <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/tasks" element={<PlaceholderPage title="Tasks" />} />
              <Route path="/habits" element={<PlaceholderPage title="Habits" />} />
              <Route path="/expenses" element={<PlaceholderPage title="Expenses" />} />
              <Route path="/fitness" element={<PlaceholderPage title="Fitness" />} />
              <Route path="/trading" element={<PlaceholderPage title="Trading" />} />
              <Route path="/cyber" element={<PlaceholderPage title="Cybersecurity" />} />
              <Route path="/notes" element={<PlaceholderPage title="Notes" />} />
            </Routes>
          </main>
          
          <MobileBottomNav />
        </div>
      </div>
    </Router>
  );
}

export default App;
