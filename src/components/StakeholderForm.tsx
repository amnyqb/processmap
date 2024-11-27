import React, { useState } from 'react';
import { useProcessStore } from '../store/processStore';

interface StakeholderFormProps {
  editId?: string;
  onComplete?: () => void;
}

export function StakeholderForm({ editId, onComplete }: StakeholderFormProps) {
  const { addStakeholder, updateStakeholder, stakeholders } = useProcessStore(state => ({
    addStakeholder: state.addStakeholder,
    updateStakeholder: state.updateStakeholder,
    stakeholders: state.stakeholders,
  }));

  const editingStakeholder = editId ? stakeholders.find(s => s.id === editId) : undefined;

  const [name, setName] = useState(editingStakeholder?.name ?? '');
  const [description, setDescription] = useState(editingStakeholder?.description ?? '');
  const [color, setColor] = useState(editingStakeholder?.color ?? '#3B82F6');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      updateStakeholder(editId, { name, description, color });
    } else {
      addStakeholder({ name, description, color });
    }
    onComplete?.();
    if (!editId) {
      setName('');
      setDescription('');
      setColor('#3B82F6');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">
        {editId ? 'Edit Stakeholder' : 'Add Stakeholder'}
      </h2>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="color" className="block text-sm font-medium text-gray-700">
          Color
        </label>
        <div className="mt-1 flex items-center space-x-2">
          <input
            type="color"
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-8 w-8 rounded cursor-pointer"
          />
          <span className="text-sm text-gray-500">{color}</span>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {editId ? 'Update Stakeholder' : 'Add Stakeholder'}
      </button>
    </form>
  );
}