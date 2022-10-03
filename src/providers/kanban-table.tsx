import React, { useMemo, useReducer, createContext, useContext  } from 'react';
import { initialState, TableReducer } from '../stores/kanban-table-reducer';

const KanbanTableContext = createContext();

export function KanbanTableProvider ({ children }) {
  const [ state, Dispatch ] = useReducer(TableReducer, initialState);

  const contextValue = useMemo(() => {
    return { state, Dispatch };
  }, [state, Dispatch]);

  return (
    <KanbanTableContext.Provider value={ contextValue }>
      { children }
    </KanbanTableContext.Provider>
  );
}

export function useKanbanTableContext() {
  return useContext(KanbanTableContext);
}