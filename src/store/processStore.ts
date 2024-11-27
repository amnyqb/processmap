import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Activity, Entity, Stakeholder, View } from '../types';

interface ProcessStore {
  currentView: View;
  stakeholders: Stakeholder[];
  setCurrentView: (view: View) => void;
  addStakeholder: (stakeholder: Omit<Stakeholder, 'id' | 'entities'>) => void;
  updateStakeholder: (id: string, updates: Partial<Omit<Stakeholder, 'id' | 'entities'>>) => void;
  addEntity: (stakeholderId: string, entity: Omit<Entity, 'id' | 'activities' | 'stakeholderId'>) => void;
  updateEntity: (id: string, updates: Partial<Omit<Entity, 'id' | 'stakeholderId' | 'activities'>>) => void;
  addActivity: (entityId: string, activity: Omit<Activity, 'id' | 'entityId'>) => void;
  updateActivity: (activityId: string, updates: Partial<Activity>) => void;
}

export const useProcessStore = create<ProcessStore>()(
  persist(
    (set) => ({
      currentView: 'stakeholders',
      stakeholders: [],
      
      setCurrentView: (view) => set({ currentView: view }),

      addStakeholder: (stakeholder) => set((state) => ({
        stakeholders: [...state.stakeholders, {
          ...stakeholder,
          id: crypto.randomUUID(),
          entities: []
        }]
      })),

      updateStakeholder: (id, updates) => set((state) => ({
        stakeholders: state.stakeholders.map(s => 
          s.id === id ? { ...s, ...updates } : s
        )
      })),

      addEntity: (stakeholderId, entity) => set((state) => ({
        stakeholders: state.stakeholders.map(s => 
          s.id === stakeholderId ? {
            ...s,
            entities: [...s.entities, {
              ...entity,
              id: crypto.randomUUID(),
              stakeholderId,
              activities: []
            }]
          } : s
        )
      })),

      updateEntity: (id, updates) => set((state) => ({
        stakeholders: state.stakeholders.map(s => ({
          ...s,
          entities: s.entities.map(e => 
            e.id === id ? { ...e, ...updates } : e
          )
        }))
      })),

      addActivity: (entityId, activity) => set((state) => ({
        stakeholders: state.stakeholders.map(s => ({
          ...s,
          entities: s.entities.map(e => 
            e.id === entityId ? {
              ...e,
              activities: [...e.activities, {
                ...activity,
                id: crypto.randomUUID(),
                entityId
              }]
            } : e
          )
        }))
      })),

      updateActivity: (activityId, updates) => set((state) => ({
        stakeholders: state.stakeholders.map(s => ({
          ...s,
          entities: s.entities.map(e => ({
            ...e,
            activities: e.activities.map(a => 
              a.id === activityId ? { ...a, ...updates } : a
            )
          }))
        }))
      }))
    }),
    {
      name: 'process-map-storage'
    }
  )
);