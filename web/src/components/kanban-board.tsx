"use client"

import React, { useState } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { KanbanColumn } from './kanban-column';
import { KanbanItem } from './kanban-item';

export type ContentStatus = "Research" | "Writing" | "Published";

export type ContentTask = {
  id: string;
  title: string;
  keyword: string;
  status: ContentStatus;
  cms: string;
};

const defaultTasks: ContentTask[] = [
  { id: '1', title: 'Top 10 SEO Strategies for 2026', keyword: 'seo strategies', status: 'Research', cms: 'WordPress' },
  { id: '2', title: 'How to use DataForSEO API', keyword: 'dataforseo tutorial', status: 'Writing', cms: 'Webflow' },
  { id: '3', title: 'A guide to Webflow CMS', keyword: 'webflow cms', status: 'Published', cms: 'Webflow' },
  { id: '4', title: 'Next.js App Router vs Pages', keyword: 'nextjs app router', status: 'Research', cms: 'Framer' },
];

export function KanbanBoard({ domain = 'example.com' }: { domain?: string }) {
  const [tasks, setTasks] = useState<ContentTask[]>(defaultTasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const handleExtract = async () => {
    setIsExtracting(true);
    try {
      const res = await fetch('/api/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: domain }),
      });
      const data = await res.json();
      
      if (data.success && data.pages) {
        const newTasks: ContentTask[] = data.pages.map((pageUrl: string, index: number) => ({
          id: `extracted-${index}`,
          title: new URL(pageUrl).pathname || 'Home',
          keyword: 'Assign Keyword...',
          status: 'Research',
          cms: 'WordPress',
        }));
        
        setTasks((prev) => [...newTasks, ...prev]);
      }
    } catch (err) {
      console.error('Extraction failed', err);
    } finally {
      setIsExtracting(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const columns: ContentStatus[] = ["Research", "Writing", "Published"];

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id as string);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveTask) return;

    // Dropping a task over another task
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].status !== tasks[overIndex].status) {
          tasks[activeIndex].status = tasks[overIndex].status;
          
          if (tasks[activeIndex].status === 'Published') {
            triggerN8nPublish(tasks[activeIndex]);
          }

          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    // Dropping a task over a column
    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const targetStatus = overId as ContentStatus;
        
        if (tasks[activeIndex].status !== targetStatus) {
           tasks[activeIndex].status = targetStatus;
           
           if (targetStatus === 'Published') {
             triggerN8nPublish(tasks[activeIndex]);
           }
           
           return arrayMove(tasks, activeIndex, activeIndex);
        }
        return tasks;
      });
    }
  }

  const triggerN8nPublish = async (task: ContentTask) => {
    try {
      const response = await fetch('/api/n8n/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'content.published',
          data: task,
        })
      });
      if (response.ok) {
        console.log(`Successfully triggered N8N webhook for task: ${task.id}`);
      } else {
        console.error("Failed to trigger N8N webhook.");
      }
    } catch (err) {
      console.error("Error triggering N8N webhook:", err);
    }
  }

  const activeTask = tasks.find((task) => task.id === activeId);

  const handleUpdateTask = (id: string, updates: Partial<ContentTask>) => {
    setTasks((prev) => 
      prev.map(task => task.id === id ? { ...task, ...updates } : task)
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="mb-6 flex justify-end">
        <button 
          onClick={handleExtract}
          disabled={isExtracting}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
        >
          {isExtracting ? 'Extracting Pages...' : 'Auto-Extract Site Pages'}
        </button>
      </div>
      <div className="flex gap-6 overflow-x-auto w-full min-h-[500px]">
        {columns.map((col) => (
          <KanbanColumn 
            key={col} 
            id={col} 
            title={col} 
            tasks={tasks.filter((task) => task.status === col)}
            onUpdateTask={handleUpdateTask} 
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <KanbanItem task={activeTask} onUpdateTask={handleUpdateTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
