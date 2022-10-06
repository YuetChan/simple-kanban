import React, { useMemo, useReducer, createContext, useContext  } from 'react';
import { initialState, ProjectCreateDialogReducer } from '../stores/kanban-project-create-dialog-reducer';

interface ProjectCreateDialogContext {
  state: {
    show: boolean
  },
  Dispatch: any
}

const KanbanProjectCreateDialogContext = createContext<ProjectCreateDialogContext>();

export function KanbanProjectCreateDialogProvider ({ children }) {
  const [ state, Dispatch ] = useReducer(ProjectCreateDialogReducer, initialState);

  const contextValue = useMemo(() => {
    return { state, Dispatch };
  }, [state, Dispatch]);

  return (
    <KanbanProjectCreateDialogContext.Provider value={ contextValue }>
      { children }
    </KanbanProjectCreateDialogContext.Provider>
  );
}

export function useKanbanProjectCreateDialogContext() {
  return useContext(KanbanProjectCreateDialogContext);
}