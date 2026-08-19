"use client"

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanItem } from './kanban-item';
import type { ContentTask } from './kanban-board';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: ContentTask[];
}

export function KanbanColumn({ id, title, tasks }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    data: {
      type: 'Column',
      id: id,
    },
  });

  return (
    <div className="flex flex-col flex-1 min-w-[300px] max-w-[400px] h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700">{title} <span className="ml-2 text-sm text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{tasks.length}</span></h3>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 p-2 rounded-xl border border-dashed transition-colors ${
          isOver ? 'bg-primary/5 border-primary/20' : 'bg-gray-50/50 border-gray-200'
        }`}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-3 min-h-[150px]">
            {tasks.map((task) => (
              <KanbanItem key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
