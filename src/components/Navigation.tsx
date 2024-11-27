import React from 'react';
import { useProcessStore } from '../store/processStore';
import { View } from '../types';
import { LayoutDashboard, Users, Activity, GitGraph } from 'lucide-react';

const navItems: { view: View; label: string; icon: React.ReactNode }[] = [
  { view: 'stakeholders', label: 'Stakeholders', icon: <Users className="w-5 h-5" /> },
  { view: 'activities', label: 'Activities', icon: <Activity className="w-5 h-5" /> },
  { view: 'process-map', label: 'Process Map', icon: <GitGraph className="w-5 h-5" /> },
];

export function Navigation() {
  const { currentView, setCurrentView } = useProcessStore(state => ({
    currentView: state.currentView,
    setCurrentView: state.setCurrentView,
  }));

  return (
    <nav className="bg-white shadow-md mb-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-8 h-16">
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="w-6 h-6 text-blue-600" />
            <span className="text-lg font-semibold">Process Map Manager</span>
          </div>
          
          <div className="flex space-x-4">
            {navItems.map(({ view, label, icon }) => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  currentView === view
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}