"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

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

interface KanbanCardProps {
  task: Task;
  onTaskClick?: (task: Task) => void;
}

const priorityColors = {
  LOW: "bg-blue-100 text-blue-800 border-blue-200",
  MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-200",
  HIGH: "bg-orange-100 text-orange-800 border-orange-200",
  URGENT: "bg-red-100 text-red-800 border-red-200",
};

export function KanbanCard({ task, onTaskClick }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "COMPLETED";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onTaskClick?.(task)}
      className={`
        bg-white border rounded-lg p-3 mb-3 cursor-grab active:cursor-grabbing
        hover:shadow-md transition-shadow
        ${isDragging ? "shadow-lg" : "shadow-sm"}
        ${isOverdue ? "border-red-300" : "border-gray-200"}
      `}
    >
      {/* Task Title */}
      <div className="font-medium text-sm mb-2 text-gray-900">{task.title}</div>

      {/* Task Description (truncated) */}
      {task.description && (
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Client & Project */}
      <div className="text-xs text-gray-500 mb-2">
        <span className="font-medium">{task.project.client.name}</span>
        <span className="mx-1">•</span>
        <span>{task.project.name}</span>
      </div>

      {/* Control Badge */}
      {task.control && (
        <Badge variant="outline" className="text-xs mb-2">
          {task.control.id}
        </Badge>
      )}

      {/* Footer: Priority, Due Date, Assignee */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
        {/* Priority */}
        <Badge
          variant="outline"
          className={`text-xs ${priorityColors[task.priority as keyof typeof priorityColors]}`}
        >
          {task.priority}
        </Badge>

        {/* Due Date & Assignee */}
        <div className="flex items-center gap-2">
          {task.dueDate && (
            <div
              className={`flex items-center text-xs ${
                isOverdue ? "text-red-600" : "text-gray-500"
              }`}
            >
              {isOverdue ? (
                <AlertCircle className="w-3 h-3 mr-1" />
              ) : (
                <Calendar className="w-3 h-3 mr-1" />
              )}
              {format(new Date(task.dueDate), "MMM d")}
            </div>
          )}

          {task.assignee && (
            <Avatar className="w-6 h-6">
              <AvatarImage src={task.assignee.image || undefined} />
              <AvatarFallback className="text-xs">
                {task.assignee.name?.charAt(0) ||
                  task.assignee.email?.charAt(0) ||
                  "?"}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </div>
  );
}
