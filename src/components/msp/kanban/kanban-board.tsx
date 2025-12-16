"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanColumn } from "./kanban-column";
import { KanbanCard } from "./kanban-card";

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

interface KanbanBoardProps {
  initialTasks: Task[];
  onTaskClick?: (task: Task) => void;
  onAddTask?: (columnId: string) => void;
}

const columns = [
  { id: "todo", title: "To Do", status: "TODO" },
  { id: "in-progress", title: "In Progress", status: "IN_PROGRESS" },
  { id: "under-review", title: "Under Review", status: "UNDER_REVIEW" },
  { id: "blocked", title: "Blocked", status: "BLOCKED" },
  { id: "completed", title: "Completed", status: "COMPLETED" },
];

export function KanbanBoard({
  initialTasks,
  onTaskClick,
  onAddTask,
}: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update tasks when initialTasks changes
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const getTasksByColumn = (columnId: string) => {
    return tasks
      .filter((task) => task.column === columnId)
      .sort((a, b) => a.position - b.position);
  };

  const findTaskById = (id: string) => {
    return tasks.find((task) => task.id === id);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the task being dragged
    const activeTask = findTaskById(activeId);
    if (!activeTask) return;

    // Determine target column
    let targetColumn = activeTask.column;

    // Check if over is a column
    if (columns.some((col) => col.id === overId)) {
      targetColumn = overId;
    } else {
      // Over is a task, get its column
      const overTask = findTaskById(overId);
      if (overTask) {
        targetColumn = overTask.column;
      }
    }

    // If column changed, update optimistically
    if (activeTask.column !== targetColumn) {
      setTasks((tasks) => {
        const updatedTasks = tasks.map((task) => {
          if (task.id === activeId) {
            return { ...task, column: targetColumn };
          }
          return task;
        });

        // Reposition tasks in target column
        const columnTasks = updatedTasks
          .filter((task) => task.column === targetColumn)
          .sort((a, b) => a.position - b.position);

        return updatedTasks.map((task) => {
          if (task.column === targetColumn) {
            const index = columnTasks.findIndex((t) => t.id === task.id);
            return { ...task, position: index };
          }
          return task;
        });
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = findTaskById(activeId);
    if (!activeTask) return;

    let targetColumn = activeTask.column;
    let newPosition = activeTask.position;

    // Determine target column
    if (columns.some((col) => col.id === overId)) {
      targetColumn = overId;
      // Moving to empty column or top of column
      const columnTasks = getTasksByColumn(targetColumn);
      newPosition = columnTasks.length;
    } else {
      // Over is a task
      const overTask = findTaskById(overId);
      if (overTask) {
        targetColumn = overTask.column;

        if (activeTask.column === targetColumn) {
          // Same column, reorder
          const columnTasks = getTasksByColumn(targetColumn);
          const oldIndex = columnTasks.findIndex((t) => t.id === activeId);
          const newIndex = columnTasks.findIndex((t) => t.id === overId);

          if (oldIndex !== newIndex) {
            const reorderedTasks = arrayMove(columnTasks, oldIndex, newIndex);

            // Update positions
            setTasks((tasks) => {
              return tasks.map((task) => {
                if (task.column === targetColumn) {
                  const index = reorderedTasks.findIndex((t) => t.id === task.id);
                  if (index !== -1) {
                    return { ...task, position: index };
                  }
                }
                return task;
              });
            });

            // Persist to backend
            await updateTaskPosition(activeId, targetColumn, newIndex);
          }
        } else {
          // Different column, move before overTask
          newPosition = overTask.position;
          setTasks((tasks) => {
            return tasks.map((task) => {
              if (task.column === targetColumn && task.position >= newPosition) {
                return { ...task, position: task.position + 1 };
              }
              return task;
            });
          });

          await updateTaskPosition(activeId, targetColumn, newPosition);
        }
      }
    }

    // If column changed, update status
    if (activeTask.column !== targetColumn) {
      const newStatus = columns.find((col) => col.id === targetColumn)?.status;
      if (newStatus) {
        await updateTaskPosition(activeId, targetColumn, newPosition, newStatus);
      }
    }
  };

  const updateTaskPosition = async (
    taskId: string,
    column: string,
    position: number,
    status?: string
  ) => {
    try {
      const updateData: any = {
        column,
        position,
      };

      if (status) {
        updateData.status = status;
      }

      const response = await fetch(`/api/msp/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const updatedTask = await response.json();

      // Update local state with server response
      setTasks((tasks) =>
        tasks.map((task) => (task.id === taskId ? updatedTask : task))
      );
    } catch (error) {
      console.error("Error updating task:", error);
      // Revert to initial tasks on error
      setTasks(initialTasks);
    }
  };

  const activeTask = activeId ? findTaskById(activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={getTasksByColumn(column.id)}
            onTaskClick={onTaskClick}
            onAddTask={onAddTask}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <KanbanCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
