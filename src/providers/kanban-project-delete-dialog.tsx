import React, { useMemo, useReducer, createContext, useContext  } from 'react';
import { initialState, ProjectDeleteDialogReducer } from '../stores/kanban-project-delete-dialog-reducer';

interface ProjectDeleteDialogContext {
  state: {
    show: boolean
  },
  Dispatch: any
}

const KanbanProjectDeleteDialogContext = createContext<ProjectDeleteDialogContext>();

export function KanbanProjectDeleteDialogProvider ({ children }) {
  const [ state, Dispatch ] = useReducer(ProjectDeleteDialogReducer, initialState);

  const contextValue = useMemo(() => {
    return { state, Dispatch };
  }, [ state, Dispatch ]);

  return (
    <KanbanProjectDeleteDialogContext.Provider value={ contextValue }>
      { children }
    </KanbanProjectDeleteDialogContext.Provider>
  );
}

export function useKanbanProjectDeleteDialogContext() {
  return useContext(KanbanProjectDeleteDialogContext);
}