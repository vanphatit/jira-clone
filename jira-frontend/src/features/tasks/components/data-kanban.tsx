import { useCallback, useState } from "react";
import { Task, TaskStatus } from "../types";

import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { KanbanColumnHeader } from "./kanban-column-header";
import { KanbanCard } from "./kanban-card";
import { useUpdateTask } from "../api/use-update-task";

interface DataKanbanProps {
  data: Task[];
  setOpen?: (open: boolean) => void;
  setInitialStatus?: (status: TaskStatus) => void;
}

const boards: TaskStatus[] = [
    //TaskStatus.BACKLOG,
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.IN_REVIEWED,
    TaskStatus.DONE,
    //TaskStatus.OVERDUE,
    TaskStatus.ARCHIVED
]

type TaskState = {
    [key in TaskStatus]: Task[]
}

export const DataKanban = ({
    data, setOpen, setInitialStatus
}: DataKanbanProps) => {
    const [tasks, setTasks] = useState<TaskState>(() => {
        const initialTasks: TaskState = {
            [TaskStatus.BACKLOG]: [],
            [TaskStatus.TODO]: [],
            [TaskStatus.IN_PROGRESS]: [],
            [TaskStatus.IN_REVIEWED]: [],
            [TaskStatus.DONE]: [],
            [TaskStatus.OVERDUE]: [],
            [TaskStatus.ARCHIVED]: []
        };

        data.forEach(task => {
            initialTasks[task.status].push(task);
        });

        Object.keys(initialTasks).forEach(key => {
            initialTasks[key as TaskStatus].sort((a, b) => a.position - b.position);
        });
        return initialTasks;
    });

    const updateTaskMutation = useUpdateTask();

    const onDragEnd = useCallback((result: DropResult) => {
      if (!result.destination) {
        return;
      }

      const { source, destination } = result;
      const sourceStatus = source.droppableId as TaskStatus;
      const destinationStatus = destination.droppableId as TaskStatus;

      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks };

        // Deep clone source column
        const sourceColumn = [...newTasks[sourceStatus]];
        const destinationColumn =
          sourceStatus === destinationStatus
            ? sourceColumn
            : [...newTasks[destinationStatus]];

        const [movedTask] = sourceColumn.splice(source.index, 1);

        if (!movedTask) {
          console.error("No task found to move");
          return prevTasks;
        }

        const updatedMovedTask =
          sourceStatus !== destinationStatus
            ? { ...movedTask, status: destinationStatus }
            : movedTask;

        destinationColumn.splice(destination.index, 0, updatedMovedTask);

        // Update positions
        const updatedSourceColumn = sourceColumn.map((task, idx) => ({
          ...task,
          position: idx,
        }));

        const updatedDestinationColumn = destinationColumn.map((task, idx) => ({
          ...task,
          position: idx,
        }));

        newTasks[sourceStatus] = updatedSourceColumn;
        newTasks[destinationStatus] = updatedDestinationColumn;

        // 🔥 Prepare update payload
        const updatesPayload: {
          _id: string;
          status: TaskStatus;
          position: number;
        }[] = [];

        updatedSourceColumn.forEach((task) => {
          updatesPayload.push({
            _id: task._id,
            status: task.status,
            position: task.position,
          });
        });

        if (sourceStatus !== destinationStatus) {
          updatedDestinationColumn.forEach((task) => {
            updatesPayload.push({
              _id: task._id,
              status: task.status,
              position: task.position,
            });
          });
        }

        console.log("Updates payload:", updatesPayload);
        updatesPayload.forEach((task) => {
          updateTaskMutation.mutate(task);
        });

        return newTasks;
      });
    }, []);    

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex overflow-x-auto">
                {boards.map((board) => {
                    return (
                      <div
                        key={board}
                        className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]"
                      >
                        <KanbanColumnHeader
                          board={board}
                          taskCount={tasks[board].length}
                          setOpen={setOpen}
                          setInitialStatus={setInitialStatus}
                        />

                        <Droppable droppableId={board}>
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="min-h-[200px] py-1.5"
                            >
                              {tasks[board].map((task, index) => (
                                <Draggable
                                  key={task._id}
                                  draggableId={task._id}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <KanbanCard task={task} />
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    );
                })}
            </div>
        </DragDropContext>
    );
}