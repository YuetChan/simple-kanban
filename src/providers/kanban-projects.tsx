import React, { useMemo, useReducer, createContext, useContext  } from 'react';
import { initialState, ProjectReducer } from '../stores/kanban-projects-reducer';

const KanbanProjectsContext = createContext();

export function KanbanProjectsProvider ({ children }) {
  const [ state, Dispatch ] = useReducer(ProjectReducer, initialState);

  const contextValue = useMemo(() => {
    return { state, Dispatch };
  }, [state, Dispatch]);

  return (
    <KanbanProjectsContext.Provider value={ contextValue }>
      { children }
    </KanbanProjectsContext.Provider>
  );
}

export function useKanbanProjectsContext() {
  return useContext(KanbanProjectsContext);
}