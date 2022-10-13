import React, { useMemo, useReducer, createContext, useContext  } from 'react';
import { initialState, TableReducer } from '../stores/kanban-table-reducer';

interface TableContext {
  state: { },
  Dispatch: any
}

const KanbanTableContext = createContext<TableContext>({
  state: {},
  Dispatch: undefined
});

export function KanbanTableProvider ({ children }: { children: any }) {
  const [ state, Dispatch ] = useReducer(TableReducer, initialState);

  const contextValue = useMemo(() => {
    return { state, Dispatch };
  }, [ state, Dispatch ]);

  return (
    <KanbanTableContext.Provider value={ contextValue }>
      { children }
    </KanbanTableContext.Provider>
  );
}

export function useKanbanTableContext() {
  return useContext(KanbanTableContext);
}