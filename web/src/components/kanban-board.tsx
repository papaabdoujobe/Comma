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
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { KanbanColumn } from './kanban-column';
import { KanbanItem } from './kanban-item';
import { ContentEditor } from './content-editor';
import { SeoScoreGauge } from './seo-score-gauge';
import { calculateSeoScore } from '@/lib/scoring';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Bot, Loader2 } from 'lucide-react';

export type ContentStatus = "research" | "writing" | "published";

export type ContentTask = {
  id: string;
  title: string;
  focus_keyword: string | null;
  status: ContentStatus;
  target_cms: string | null;
  content_body: string;
};

import { createClient } from '@/utils/supabase/client';

export function KanbanBoard({ domain = 'example.com', initialTasks = [], userId }: { domain?: string, initialTasks?: any[], userId?: string }) {
  // Map Supabase rows to our ContentTask type
  const mappedTasks = initialTasks.map(t => ({
    id: t.id,
    title: t.title,
    focus_keyword: t.focus_keyword || 'Assign Keyword...',
    status: (t.status || 'research') as ContentStatus,
    target_cms: t.target_cms || 'WordPress',
    content_body: t.content_body || ''
  }));

  const [tasks, setTasks] = useState<ContentTask[]>(mappedTasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const supabase = createClient();
  
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [credits, setCredits] = useState(50); // Mock credits

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
        const newTasksToInsert = data.pages.map((pageUrl: string, index: number) => ({
          user_id: userId,
          domain,
          title: new URL(pageUrl).pathname || 'Home',
          focus_keyword: null,
          status: 'research',
          target_cms: 'WordPress',
          content_body: '',
        }));
        
        const { data: insertedData, error } = await supabase
          .from('content_drafts')
          .insert(newTasksToInsert)
          .select();

        if (error) throw error;

        if (insertedData) {
          const newTasks: ContentTask[] = insertedData.map(t => ({
             id: t.id,
             title: t.title,
             focus_keyword: 'Assign Keyword...',
             status: 'research',
             target_cms: 'WordPress',
             content_body: ''
          }));
          setTasks((prev) => [...newTasks, ...prev]);
        }
      }
    } catch (err) {
      console.error('Extraction failed', err);
    } finally {
      setIsExtracting(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Requires moving 5px to start drag, allowing clicks to pass through
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const columns: ContentStatus[] = ["research", "writing", "published"];

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id as string);
  }

  async function updateStatusInDB(id: string, newStatus: string) {
    await supabase.from('content_drafts').update({ status: newStatus }).eq('id', id);
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
          const newStatus = tasks[overIndex].status;
          tasks[activeIndex].status = newStatus;
          updateStatusInDB(activeId as string, newStatus);
          
          if (newStatus === 'published') {
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
           updateStatusInDB(activeId as string, targetStatus);
           
           if (targetStatus === 'published') {
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

  const selectedTask = tasks.find(t => t.id === selectedTaskId);
  const currentScore = selectedTask ? calculateSeoScore(selectedTask.content_body || '', selectedTask.focus_keyword || '') : 0;

  const handleAutoOptimize = async () => {
    if (!selectedTask || credits < 1) return;
    setIsOptimizing(true);
    
    try {
      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: selectedTask.content_body || '', keyword: selectedTask.focus_keyword || '' }),
      });
      const data = await res.json();
      if (data.success) {
        handleUpdateTask(selectedTask.id, { content_body: data.optimizedHtml });
        await supabase.from('content_drafts').update({ content_body: data.optimizedHtml }).eq('id', selectedTask.id);
        setCredits(prev => prev - 1);
      }
    } catch (error) {
      console.error('Optimization failed', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="mb-6 flex justify-end items-center gap-4">
          <div className="bg-white px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 shadow-sm border border-gray-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            {credits} AI Credits
          </div>
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
              onSelectTask={setSelectedTaskId}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <KanbanItem task={activeTask} onUpdateTask={handleUpdateTask} /> : null}
        </DragOverlay>
      </DndContext>

      <Sheet open={!!selectedTaskId} onOpenChange={(open) => !open && setSelectedTaskId(null)}>
        <SheetContent side="right" className="w-[800px] sm:max-w-[800px] sm:w-[90vw] p-0 flex flex-col bg-gray-50 overflow-y-auto">
          {selectedTask && (
            <>
              <div className="p-6 border-b bg-white flex justify-between items-start sticky top-0 z-10">
                <div>
                  <SheetTitle className="text-2xl font-bold text-gray-900">{selectedTask.title}</SheetTitle>
                  <p className="text-sm text-gray-500 mt-1">Focus Keyword: <span className="font-semibold text-primary">{selectedTask.focus_keyword}</span></p>
                </div>
                <div className="flex gap-4 items-center">
                  <SeoScoreGauge score={currentScore} />
                  <button 
                    onClick={handleAutoOptimize}
                    disabled={isOptimizing || credits < 1}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isOptimizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                    Auto-Optimize (1 Credit)
                  </button>
                </div>
              </div>
              <div className="p-6 flex-1">
                <ContentEditor 
                  content={selectedTask.content_body || ''} 
                  onChange={async (html) => {
                    handleUpdateTask(selectedTask.id, { content_body: html });
                    await supabase.from('content_drafts').update({ content_body: html }).eq('id', selectedTask.id);
                  }} 
                />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
