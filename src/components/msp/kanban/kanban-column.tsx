"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanCard } from "./kanban-card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  column: string;
  position: number;
  dueDate: Date | string | null;
  assignee: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
  project: {
    id: string;
    name: string;
    client: {
      id: string;
      name: string;
    };
  };
  control: {
    id: string;
    domain: string;
    practice: string;
  } | null;
}

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onAddTask?: (columnId: string) => void;
}

const columnColors = {
  todo: "bg-gray-50 border-gray-200",
  "in-progress": "bg-blue-50 border-blue-200",
  "under-review": "bg-purple-50 border-purple-200",
  blocked: "bg-red-50 border-red-200",
  completed: "bg-green-50 border-green-200",
};

export function KanbanColumn({
  id,
  title,
  tasks,
  onTaskClick,
  onAddTask,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  const taskIds = tasks.map((task) => task.id);

  return (
    <div
      className={`flex flex-col w-80 flex-shrink-0 rounded-lg border-2 ${
        columnColors[id as keyof typeof columnColors] || "bg-gray-50 border-gray-200"
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-gray-900">{title}</h3>
          <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAddTask?.(id)}
          className="h-7 w-7 p-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Column Body - Droppable Area */}
      <div
        ref={setNodeRef}
        className="flex-1 p-3 overflow-y-auto min-h-[200px] max-h-[calc(100vh-300px)]"
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} onTaskClick={onTaskClick} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400">
            <p className="text-sm">No tasks</p>
            <button
              onClick={() => onAddTask?.(id)}
              className="text-xs text-blue-600 hover:text-blue-700 mt-2"
            >
              Add task
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
