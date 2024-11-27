import React from 'react';
import { Navigation } from './components/Navigation';
import { StakeholderGrid } from './components/StakeholderGrid';
import { ActivitiesList } from './components/ActivitiesList';
import { ActivityCanvas } from './components/ActivityCanvas';
import { useProcessStore } from './store/processStore';
import { Toaster } from 'sonner';

function App() {
  const { currentView } = useProcessStore();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      <main className="py-8">
        {currentView === 'stakeholders' && <StakeholderGrid />}
        {currentView === 'activities' && <ActivitiesList />}
        {currentView === 'process-map' && <ActivityCanvas />}
      </main>

      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;