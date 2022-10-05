import React, { useMemo, useReducer, createContext, useContext  } from 'react';
import { initialState, TaskReducer } from '../stores/kanban-tasks-reducer';

import { Task } from '../features/Task';

interface TasksContext {
  state: {
    _allTasks: {
      'backlog': Array<Task>,
      'todo': Array<Task>,
      'inProgress': Array<Task>,
      'done': Array<Task>
    }
  },
  Dispatch: any
}

const KanbanTasksContext = createContext<TasksContext>();

export function KanbanTasksProvider ({ children }) {
  const [ state, Dispatch ] = useReducer(TaskReducer, initialState);

  const contextValue = useMemo(() => {
    return { state, Dispatch };
  }, [ state, Dispatch ]);

  return (
    <KanbanTasksContext.Provider value={ contextValue }>
      { children }
    </KanbanTasksContext.Provider>
  );
}

export function useKanbanTasksContext() {
  return useContext(KanbanTasksContext);
}