import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Plus, Pencil, Clock, CheckCircle } from 'lucide-react';
import { useProcessStore } from '../store/processStore';
import { ActivityForm } from './ActivityForm';
import { format } from 'date-fns';

export function ActivitiesList() {
  const { stakeholders } = useProcessStore();
  const [addingActivityTo, setAddingActivityTo] = useState<string | null>(null);
  const [editingActivity, setEditingActivity] = useState<string | null>(null);

  const statusIcons = {
    'pending': <Clock className="w-4 h-4 text-yellow-500" />,
    'in-progress': <Clock className="w-4 h-4 text-blue-500" />,
    'completed': <CheckCircle className="w-4 h-4 text-green-500" />
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
      </div>

      <div className="space-y-6">
        {stakeholders.map(stakeholder => (
          <div key={stakeholder.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div 
              className="px-6 py-4"
              style={{ borderLeft: `4px solid ${stakeholder.color}` }}
            >
              <h2 className="text-xl font-semibold text-gray-900">{stakeholder.name}</h2>
              
              <div className="mt-4 space-y-4">
                {stakeholder.entities.map(entity => (
                  <div key={entity.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 
                        className="text-lg font-medium text-gray-800"
                        style={{ color: entity.color }}
                      >
                        {entity.name}
                      </h3>
                      <button
                        onClick={() => setAddingActivityTo(entity.id)}
                        className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Activity</span>
                      </button>
                    </div>

                    <div className="bg-gray-50 rounded-lg">
                      {entity.activities.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Activity
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Timeline
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Deliverables
                              </th>
                              <th className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {entity.activities.map(activity => (
                              <tr key={activity.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {activity.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {activity.description}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm text-gray-900">
                                    {format(new Date(activity.startDate), 'MMM d, yyyy')}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    to {format(new Date(activity.deadline), 'MMM d, yyyy')}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center space-x-1">
                                    {statusIcons[activity.status]}
                                    <span className="text-sm capitalize">{activity.status}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm text-gray-900">
                                    {activity.deliverables.length} deliverables
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-right text-sm font-medium">
                                  <button
                                    onClick={() => setEditingActivity(activity.id)}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="px-6 py-4 text-sm text-gray-500">
                          No activities yet
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={addingActivityTo !== null || editingActivity !== null}
        onClose={() => {
          setAddingActivityTo(null);
          setEditingActivity(null);
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl">
            <ActivityForm
              entityId={addingActivityTo ?? undefined}
              editId={editingActivity ?? undefined}
              onComplete={() => {
                setAddingActivityTo(null);
                setEditingActivity(null);
              }}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}