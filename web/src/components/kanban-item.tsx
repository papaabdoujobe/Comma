"use client"

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ContentTask } from './kanban-board';
import { FileText, MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card"

interface KanbanItemProps {
  task: ContentTask;
}

export function KanbanItem({ task }: KanbanItemProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 border-2 border-primary rounded-xl h-24"
      />
    );
  }

  const getCmsColor = (cms: string) => {
    switch (cms) {
      case 'WordPress': return 'bg-blue-100 text-blue-700';
      case 'Webflow': return 'bg-indigo-100 text-indigo-700';
      case 'Framer': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="rounded-xl border-none shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow relative bg-white group"
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md ${getCmsColor(task.cms)}`}>
            {task.cms}
          </span>
          <button className="text-gray-300 hover:text-gray-500 transition-colors opacity-0 group-hover:opacity-100">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
        <h4 className="font-semibold text-gray-900 text-sm leading-snug mb-3">
          {task.title}
        </h4>
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
          <FileText className="w-3 h-3 text-gray-400" />
          <span>{task.keyword}</span>
        </div>
      </CardContent>
    </Card>
  );
}
