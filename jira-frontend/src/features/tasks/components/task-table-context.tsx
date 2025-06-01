"use client";

import { createContext, useContext } from "react";

interface Member {
  userId: {
    _id: string;
    name: string;
    avatar: string;
  };
}

interface TaskTableContextType {
  members: Member[];
}

export const TaskTableContext = createContext<TaskTableContextType>({
  members: [],
});

export const useTaskTable = () => useContext(TaskTableContext);
