import React, { useMemo, useReducer, createContext, useContext  } from 'react';
import { initialState, TaskReducer } from '../stores/kanban-tasks-reducer';

const KanbanTasksContext = createContext();

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