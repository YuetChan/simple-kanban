import React, { useMemo, useReducer, createContext, useContext  } from 'react';
import { initialState, CardUpdateReducer } from '../stores/kanban-card-update-reducer';

const KanbanCardUpdateContext = createContext();

export function KanbanCardUpdateProvider ({ children }) {
  const [ state, Dispatch ] = useReducer(CardUpdateReducer, initialState);

  const contextValue = useMemo(() => {
    return { state, Dispatch };
  }, [ state, Dispatch ]);

  return (
    <KanbanCardUpdateContext.Provider value={ contextValue }>
      { children }
    </KanbanCardUpdateContext.Provider>
  );
}

export function useKanbanCardUpdateContext() {
  return useContext(KanbanCardUpdateContext);
}