import React, { useState } from 'react';
import { useProcessStore } from '../store/processStore';
import { Activity, RaciRole } from '../types';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface ActivityFormProps {
  entityId?: string;
  editId?: string;
  onComplete?: () => void;
}

interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionSection({ title, children, isOpen, onToggle }: AccordionSectionProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        type="button" // Prevent form submission
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100"
        onClick={(e) => {
          e.preventDefault(); // Prevent form submission
          onToggle();
        }}
      >
        <span className="font-medium text-gray-900">{title}</span>
        {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>
      {isOpen && <div className="p-4 bg-white">{children}</div>}
    </div>
  );
}

export function ActivityForm({ entityId, editId, onComplete }: ActivityFormProps) {
  const { addActivity, updateActivity, stakeholders } = useProcessStore();
  const [openSections, setOpenSections] = useState({
    basic: true,
    timeline: false,
    deliverables: false,
    dependencies: false,
    raci: false,
  });

  const allEntities = stakeholders.flatMap(s => s.entities);
  const editingActivity = editId 
    ? allEntities.flatMap(e => e.activities).find(a => a.id === editId)
    : undefined;

  const [name, setName] = useState(editingActivity?.name ?? '');
  const [description, setDescription] = useState(editingActivity?.description ?? '');
  const [status, setStatus] = useState<Activity['status']>(editingActivity?.status ?? 'pending');
  const [startDate, setStartDate] = useState(editingActivity?.startDate ?? format(new Date(), 'yyyy-MM-dd'));
  const [deadline, setDeadline] = useState(editingActivity?.deadline ?? format(new Date(), 'yyyy-MM-dd'));
  const [deliverables, setDeliverables] = useState<string[]>(editingActivity?.deliverables ?? []);
  const [newDeliverable, setNewDeliverable] = useState('');
  const [dependencies, setDependencies] = useState<string[]>(editingActivity?.dependencies ?? []);
  const [selectedStakeholder, setSelectedStakeholder] = useState<string | null>(null);
  const [raci, setRaci] = useState<Record<RaciRole, string[]>>(editingActivity?.raci ?? {
    responsible: [],
    accountable: [],
    consulted: [],
    informed: []
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const addDeliverable = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    if (newDeliverable.trim()) {
      setDeliverables(prev => [...prev, newDeliverable.trim()]);
      setNewDeliverable('');
    }
  };

  const removeDeliverable = (index: number) => {
    setDeliverables(prev => prev.filter((_, i) => i !== index));
  };

  const updateRaci = (role: RaciRole, id: string, checked: boolean) => {
    setRaci(prev => ({
      ...prev,
      [role]: checked 
        ? [...prev[role], id]
        : prev[role].filter(existingId => existingId !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const activityData = {
      name,
      description,
      status,
      startDate,
      deadline,
      deliverables,
      dependencies,
      raci
    };

    try {
      if (editId) {
        updateActivity(editId, activityData);
        toast.success('Activity updated successfully');
      } else if (entityId) {
        addActivity(entityId, activityData);
        toast.success('Activity added successfully');
      }
      onComplete?.();
    } catch (error) {
      toast.error('Failed to save activity');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow max-h-[80vh] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-6">
        {editId ? 'Edit Activity' : 'Add Activity'}
      </h2>

      <div className="space-y-3">
        <AccordionSection
          title="Basic Information"
          isOpen={openSections.basic}
          onToggle={() => toggleSection('basic')}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
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
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as Activity['status'])}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </AccordionSection>

        <AccordionSection
          title="Timeline"
          isOpen={openSections.timeline}
          onToggle={() => toggleSection('timeline')}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline</label>
              <input
                type="date"
                id="deadline"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </AccordionSection>

        <AccordionSection
          title="Deliverables"
          isOpen={openSections.deliverables}
          onToggle={() => toggleSection('deliverables')}
        >
          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newDeliverable}
                onChange={(e) => setNewDeliverable(e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Add deliverable"
              />
              <button
                type="button"
                onClick={addDeliverable}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <ul className="space-y-2">
              {deliverables.map((deliverable, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                  <span>{deliverable}</span>
                  <button
                    type="button"
                    onClick={() => removeDeliverable(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </AccordionSection>

        <AccordionSection
          title="Dependencies"
          isOpen={openSections.dependencies}
          onToggle={() => toggleSection('dependencies')}
        >
          <select
            multiple
            value={dependencies}
            onChange={(e) => setDependencies(Array.from(e.target.selectedOptions, option => option.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            size={5}
          >
            {allEntities.flatMap(entity => 
              entity.activities
                .filter(activity => activity.id !== editId)
                .map(activity => (
                  <option key={activity.id} value={activity.id}>
                    {`${entity.name} - ${activity.name}`}
                  </option>
                ))
            )}
          </select>
        </AccordionSection>

        <AccordionSection
          title="RACI Matrix"
          isOpen={openSections.raci}
          onToggle={() => toggleSection('raci')}
        >
          <div className="space-y-6">
            {(['responsible', 'accountable', 'consulted', 'informed'] as const).map(role => (
              <div key={role} className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 capitalize">{role}</h4>
                <div className="space-y-4">
                  {stakeholders.map(stakeholder => (
                    <div key={stakeholder.id} className="space-y-2">
                      <div 
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={() => setSelectedStakeholder(selectedStakeholder === stakeholder.id ? null : stakeholder.id)}
                      >
                        <div className="w-4 h-4">
                          {selectedStakeholder === stakeholder.id ? '▼' : '▶'}
                        </div>
                        <span className="font-medium">{stakeholder.name}</span>
                      </div>
                      
                      {selectedStakeholder === stakeholder.id && (
                        <div className="ml-6 space-y-2">
                          {stakeholder.entities.length > 0 ? (
                            stakeholder.entities.map(entity => (
                              <label key={entity.id} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={raci[role].includes(entity.id)}
                                  onChange={(e) => updateRaci(role, entity.id, e.target.checked)}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span>{entity.name}</span>
                              </label>
                            ))
                          ) : (
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={raci[role].includes(stakeholder.id)}
                                onChange={(e) => updateRaci(role, stakeholder.id, e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span>{stakeholder.name}</span>
                            </label>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </AccordionSection>
      </div>

      <div className="pt-4 border-t">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {editId ? 'Update Activity' : 'Add Activity'}
        </button>
      </div>
    </form>
  );
}