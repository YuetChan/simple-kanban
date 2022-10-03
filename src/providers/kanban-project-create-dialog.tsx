import React, { useMemo, useReducer, createContext, useContext  } from 'react';

import { initialState, ProjectCreateDialogReducer } from '../stores/kanban-project-create-dialog-reducer';

const KanbanProjectCreateDialogContext = createContext();

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