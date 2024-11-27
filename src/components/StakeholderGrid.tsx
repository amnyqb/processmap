import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useProcessStore } from '../store/processStore';
import { StakeholderForm } from './StakeholderForm';
import { EntityForm } from './EntityForm';
import { Pencil, Plus, Building2 } from 'lucide-react';

export function StakeholderGrid() {
  const { stakeholders } = useProcessStore();
  const [editingStakeholder, setEditingStakeholder] = useState<string | null>(null);
  const [editingEntity, setEditingEntity] = useState<string | null>(null);
  const [addingEntityTo, setAddingEntityTo] = useState<string | null>(null);
  const [isAddingStakeholder, setIsAddingStakeholder] = useState(false);

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Stakeholders & Entities</h1>
        <button
          onClick={() => setIsAddingStakeholder(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          <span>Add Stakeholder</span>
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stakeholders.map((stakeholder) => (
          <div
            key={stakeholder.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
            style={{ borderTop: `4px solid ${stakeholder.color}` }}
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{stakeholder.name}</h2>
                  <p className="text-sm text-gray-600">{stakeholder.description}</p>
                </div>
                <button
                  onClick={() => setEditingStakeholder(stakeholder.id)}
                  className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                  <span className="flex items-center space-x-1">
                    <Building2 className="w-4 h-4" />
                    <span>Entities</span>
                  </span>
                  <button
                    onClick={() => setAddingEntityTo(stakeholder.id)}
                    className="p-1 text-blue-600 hover:text-blue-700 rounded-full hover:bg-blue-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  {stakeholder.entities.map((entity) => (
                    <div
                      key={entity.id}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
                      style={{ borderLeft: `3px solid ${entity.color}` }}
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">{entity.name}</h3>
                        <p className="text-xs text-gray-600">{entity.description}</p>
                      </div>
                      <button
                        onClick={() => setEditingEntity(entity.id)}
                        className="p-1 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Stakeholder Dialog */}
      <Dialog
        open={isAddingStakeholder}
        onClose={() => setIsAddingStakeholder(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md">
            <StakeholderForm onComplete={() => setIsAddingStakeholder(false)} />
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Edit Stakeholder Dialog */}
      <Dialog
        open={editingStakeholder !== null}
        onClose={() => setEditingStakeholder(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md">
            <StakeholderForm
              editId={editingStakeholder ?? undefined}
              onComplete={() => setEditingStakeholder(null)}
            />
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Add Entity Dialog */}
      <Dialog
        open={addingEntityTo !== null}
        onClose={() => setAddingEntityTo(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md">
            <EntityForm
              stakeholder={stakeholders.find(s => s.id === addingEntityTo)}
              onComplete={() => setAddingEntityTo(null)}
            />
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Edit Entity Dialog */}
      <Dialog
        open={editingEntity !== null}
        onClose={() => setEditingEntity(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md">
            <EntityForm
              editId={editingEntity ?? undefined}
              onComplete={() => setEditingEntity(null)}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}