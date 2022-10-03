import React, { useMemo, useReducer, createContext, useContext  } from 'react';
import { initialState, CardCreateReducer } from '../stores/kanban-card-create-reducer';

const KanbanCardCreateContext = createContext();

export function KanbanCardCreateProvider ({ children }) {
  const [ state, Dispatch ] = useReducer(CardCreateReducer, initialState);

  const contextValue = useMemo(() => {
    return { state, Dispatch };
  }, [ state, Dispatch ]);

  return (
    <KanbanCardCreateContext.Provider value={ contextValue }>
      { children }
    </KanbanCardCreateContext.Provider>
  );
}

export function useKanbanCardCreateContext() {
  return useContext(KanbanCardCreateContext);
}