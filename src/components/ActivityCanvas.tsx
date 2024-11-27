import React, { useMemo, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Plus } from 'lucide-react';
import { useProcessStore } from '../store/processStore';
import { ActivityForm } from './ActivityForm';
import { format, addMonths, startOfMonth, getDaysInMonth, isSameMonth } from 'date-fns';

const CELL_HEIGHT = 80;
const CELL_WIDTH = 200;
const HEADER_HEIGHT = 80;
const FIXED_COL_WIDTH = 200;
const NODE_SIZE = 24;

export function ActivityCanvas() {
  const [addingActivityTo, setAddingActivityTo] = useState<string | null>(null);
  const { stakeholders } = useProcessStore();
  
  //const startDate = startOfMonth(new Date());
  

  const startDate = startOfMonth(new Date(2024, 0, 1)); // January 2024
  const months = Array.from({ length: 12 }, (_, i) => addMonths(startDate, i));

  // Create a map of stakeholder IDs to their starting row indices and row spans
  const stakeholderRows = useMemo(() => {
    const rows = new Map();
    let currentRow = 0;
    
    stakeholders.forEach(stakeholder => {
      rows.set(stakeholder.id, {
        startRow: currentRow,
        rowSpan: stakeholder.entities.length
      });
      currentRow += stakeholder.entities.length;
    });
    
    return rows;
  }, [stakeholders]);

  // Create a map of entity IDs to their row indices
  const entityRowIndices = useMemo(() => {
    const indices = new Map<string, number>();
    let currentIndex = 0;
    
    stakeholders.forEach(stakeholder => {
      stakeholder.entities.forEach(entity => {
        indices.set(entity.id, currentIndex);
        currentIndex++;
      });
    });
    
    return indices;
  }, [stakeholders]);

  // Calculate activities with their positions
  const activities = useMemo(() => {
    const result = [];
    
    stakeholders.forEach(stakeholder => {
      stakeholder.entities.forEach(entity => {
        const rowIndex = entityRowIndices.get(entity.id);
        
        if (rowIndex !== undefined) {
          entity.activities.forEach(activity => {
            const deadline = new Date(activity.deadline);
            const monthIndex = months.findIndex(month => isSameMonth(month, deadline));
            
            if (monthIndex !== -1) {
              const daysInMonth = getDaysInMonth(months[monthIndex]);
              const dayOfMonth = deadline.getDate();
              const dayOffset = (dayOfMonth / daysInMonth) * CELL_WIDTH;
              
              const x = (2 * FIXED_COL_WIDTH) + (monthIndex * CELL_WIDTH) + dayOffset;
              // Position nodes in the middle of their entity row, shifted up by one row height
              const y = (rowIndex * CELL_HEIGHT) + (CELL_HEIGHT / 2) + HEADER_HEIGHT - CELL_HEIGHT;
              
              result.push({
                id: activity.id,
                activity,
                entity,
                stakeholder,
                x,
                y,
                entityColor: entity.color,
                rowIndex
              });
            }
          });
        }
      });
    });
    
    return result;
  }, [stakeholders, months, entityRowIndices]);

  // Rest of the component remains the same...
  const connections = useMemo(() => {
    const result = [];
    
    activities.forEach(source => {
      source.activity.dependencies.forEach(targetId => {
        const target = activities.find(a => a.id === targetId);
        if (target) {
          const sourceX = source.x + (NODE_SIZE / 2);
          const targetX = target.x - (NODE_SIZE / 2);
          const sourceY = source.y;
          const targetY = target.y;
          
          // Calculate the midpoint for horizontal routing
          const midX = sourceX + (targetX - sourceX) / 2;
          
          // Create orthogonal path with 90-degree turns
          const path = `
            M ${sourceX} ${sourceY}
            H ${midX}
            V ${targetY}
            H ${targetX}
          `.replace(/\s+/g, ' ').trim();
          
          result.push({
            id: `${source.id}-${target.id}`,
            source,
            target,
            color: source.entityColor,
            path
          });
        }
      });
    });
    
    return result;
  }, [activities]);

  const totalWidth = (2 * FIXED_COL_WIDTH) + (months.length * CELL_WIDTH);
  const totalHeight = Math.max(
    (stakeholders.reduce((acc, s) => acc + s.entities.length, 0) * CELL_HEIGHT) + HEADER_HEIGHT,
    600
  );

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Process Map</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-auto">
        <div className="relative" style={{ width: totalWidth, minHeight: totalHeight }}>
          {/* Fixed Header */}
          <div className="sticky top-0 z-10 bg-white">
            <div className="grid grid-cols-[200px_200px_1fr] border-b">
              <div className="h-20 border-r p-4 font-medium text-gray-700 bg-white">Stakeholder</div>
              <div className="h-20 border-r p-4 font-medium text-gray-700 bg-white">Entity</div>
              <div className="flex">
                {months.map((month) => (
                  <div
                    key={month.getTime()}
                    className="border-r p-4 font-medium text-gray-700 bg-white"
                    style={{ width: CELL_WIDTH }}
                  >
                    {format(month, 'MMMM yyyy')}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Grid Content */}
          <div className="relative">
            <div className="grid grid-cols-[200px_200px_1fr]">
              {/* Stakeholder Column */}
              <div className="relative">
                {stakeholders.map((stakeholder) => {
                  const rowInfo = stakeholderRows.get(stakeholder.id);
                  return rowInfo && (
                    <div
                      key={stakeholder.id}
                      className="absolute border-r p-4 font-medium"
                      style={{
                        borderLeft: `4px solid ${stakeholder.color}`,
                        top: rowInfo.startRow * CELL_HEIGHT,
                        height: rowInfo.rowSpan * CELL_HEIGHT,
                        width: '100%'
                      }}
                    >
                      {stakeholder.name}
                    </div>
                  );
                })}
              </div>

              {/* Entity Column and Timeline Grid */}
              <div className="col-span-2">
                {stakeholders.map((stakeholder) => (
                  stakeholder.entities.map((entity) => {
                    const rowIndex = entityRowIndices.get(entity.id);
                    return rowIndex !== undefined && (
                      <div
                        key={entity.id}
                        className="grid grid-cols-[200px_1fr] border-b"
                        style={{ height: CELL_HEIGHT }}
                      >
                        <div
                          className="border-r p-4 relative group"
                          style={{ borderLeft: `2px solid ${entity.color}` }}
                        >
                          <div className="flex items-center justify-between">
                            <span>{entity.name}</span>
                            <button
                              onClick={() => setAddingActivityTo(entity.id)}
                              className="p-1 text-blue-600 opacity-0 group-hover:opacity-100 hover:bg-blue-50 rounded-full"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-12 gap-0">
                          {months.map((month) => (
                            <div
                              key={month.getTime()}
                              className="border-r h-full relative"
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })
                ))}
              </div>
            </div>

            {/* Connection Lines (rendered first to be behind nodes) */}
            <svg
              className="absolute top-0 left-0 pointer-events-none"
              style={{ width: totalWidth, height: totalHeight }}
            >
              {connections.map(({ id, path, color }) => (
                <path
                  key={id}
                  d={path}
                  stroke={color}
                  strokeWidth="2"
                  fill="none"
                  opacity="0.6"
                />
              ))}
            </svg>

            {/* Activity Nodes (rendered last to be on top) */}
            {activities.map(({ id, x, y, activity, entityColor }) => (
              <div
                key={id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-110 z-10"
                style={{
                  left: x,
                  top: y,
                  width: NODE_SIZE,
                  height: NODE_SIZE
                }}
                title={`${activity.name} (${format(new Date(activity.deadline), 'MMM d, yyyy')})`}
              >
                <div
                  className="w-full h-full rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: entityColor }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog
        open={addingActivityTo !== null}
        onClose={() => setAddingActivityTo(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl">
            <ActivityForm
              entityId={addingActivityTo ?? undefined}
              onComplete={() => setAddingActivityTo(null)}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}