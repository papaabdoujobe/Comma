"use client"

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ContentTask } from './kanban-board';
import { FileText, MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface KanbanItemProps {
  task: ContentTask;
  onUpdateTask: (id: string, updates: Partial<ContentTask>) => void;
  onSelectTask?: (id: string) => void;
}

import { createClient } from '@/utils/supabase/client';

export function KanbanItem({ task, onUpdateTask, onSelectTask }: KanbanItemProps) {
  const [keyword, setKeyword] = useState(task.focus_keyword || '');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const supabase = createClient();

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

  const handleSave = async () => {
    onUpdateTask(task.id, { focus_keyword: keyword });
    await supabase.from('content_drafts').update({ focus_keyword: keyword }).eq('id', task.id);
    setIsDialogOpen(false);
  };

  const handleCardClick = () => {
    if (onSelectTask) {
      onSelectTask(task.id);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={handleCardClick}
        className="rounded-xl border-none shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow relative bg-white group"
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md ${getCmsColor(task.target_cms || 'WordPress')}`}>
              {task.target_cms || 'WordPress'}
            </span>
            <DialogTrigger 
              onPointerDown={(e: React.PointerEvent) => e.stopPropagation()} 
              className="text-gray-300 hover:text-gray-500 transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center bg-transparent border-none p-0 cursor-pointer"
            >
              <MoreHorizontal className="w-4 h-4" />
            </DialogTrigger>
          </div>
          <h4 className="font-semibold text-gray-900 text-sm leading-snug mb-3 line-clamp-2">
            {task.title}
          </h4>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <FileText className="w-3 h-3 text-gray-400" />
            <span className="truncate">{task.focus_keyword}</span>
          </div>
        </CardContent>
      </Card>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Keyword</DialogTitle>
          <DialogDescription>
            Assign a focus keyword for this page. Our AI will grade your content against it.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. best seo tools"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Keyword</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
