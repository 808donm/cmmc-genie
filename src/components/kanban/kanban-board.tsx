"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  assignee?: {
    name: string;
    image?: string;
  };
  dueDate?: Date;
}

export interface KanbanColumn {
  id: string;
  title: string;
  tasks: KanbanTask[];
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onTaskMove?: (taskId: string, sourceColumnId: string, destColumnId: string, newIndex: number) => void;
  onTaskClick?: (task: KanbanTask) => void;
  onAddTask?: (columnId: string) => void;
}

const priorityColors = {
  LOW: "bg-slate-100 text-slate-700",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-orange-100 text-orange-700",
  CRITICAL: "bg-red-100 text-red-700",
};

export function KanbanBoard({ columns: initialColumns, onTaskMove, onTaskClick, onAddTask }: KanbanBoardProps) {
  const [columns, setColumns] = useState(initialColumns);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Dropped outside a valid droppable
    if (!destination) {
      return;
    }

    // Dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = columns.find((col) => col.id === source.droppableId);
    const destColumn = columns.find((col) => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) {
      return;
    }

    // Moving within the same column
    if (source.droppableId === destination.droppableId) {
      const newTasks = Array.from(sourceColumn.tasks);
      const [removed] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, removed);

      const newColumns = columns.map((col) =>
        col.id === sourceColumn.id ? { ...col, tasks: newTasks } : col
      );

      setColumns(newColumns);
    } else {
      // Moving to a different column
      const sourceTasks = Array.from(sourceColumn.tasks);
      const destTasks = Array.from(destColumn.tasks);
      const [removed] = sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, removed);

      const newColumns = columns.map((col) => {
        if (col.id === sourceColumn.id) {
          return { ...col, tasks: sourceTasks };
        }
        if (col.id === destColumn.id) {
          return { ...col, tasks: destTasks };
        }
        return col;
      });

      setColumns(newColumns);

      // Notify parent component
      if (onTaskMove) {
        onTaskMove(draggableId, source.droppableId, destination.droppableId, destination.index);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-80">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">
                    {column.title}
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      {column.tasks.length}
                    </span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onAddTask?.(column.id)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        "min-h-[200px] space-y-2 rounded-lg p-2 transition-colors",
                        snapshot.isDraggingOver && "bg-slate-50"
                      )}
                    >
                      {column.tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => onTaskClick?.(task)}
                              className={cn(
                                "group cursor-pointer rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md",
                                snapshot.isDragging && "shadow-lg ring-2 ring-blue-500"
                              )}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="text-sm font-medium text-slate-900">
                                  {task.title}
                                </h4>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </div>

                              {task.description && (
                                <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                                  {task.description}
                                </p>
                              )}

                              <div className="mt-3 flex items-center justify-between">
                                {task.priority && (
                                  <span
                                    className={cn(
                                      "rounded-full px-2 py-0.5 text-xs font-medium",
                                      priorityColors[task.priority]
                                    )}
                                  >
                                    {task.priority}
                                  </span>
                                )}

                                {task.assignee && (
                                  <div className="flex items-center gap-2">
                                    {task.assignee.image ? (
                                      <img
                                        src={task.assignee.image}
                                        alt={task.assignee.name}
                                        className="h-6 w-6 rounded-full"
                                      />
                                    ) : (
                                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-medium">
                                        {task.assignee.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")
                                          .toUpperCase()
                                          .slice(0, 2)}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>

                              {task.dueDate && (
                                <div className="mt-2 text-xs text-slate-500">
                                  Due: {new Date(task.dueDate).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
