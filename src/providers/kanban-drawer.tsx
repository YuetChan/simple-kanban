import React, { useMemo, useReducer, createContext, useContext  } from 'react';
import { initialState, DrawerReducer } from '../stores/kanban-drawer-reducer';

const KanbanDrawerContext = createContext();

export function KanbanDrawerProvider ({ children }) {
  const [ state, Dispatch ] = useReducer(DrawerReducer, initialState);

  const contextValue = useMemo(() => {
    return { state, Dispatch };
  }, [ state, Dispatch ]);

  return (
    <KanbanDrawerContext.Provider value={ contextValue }>
      { children }
    </KanbanDrawerContext.Provider>
  );
}

export function useKanbanDrawerContext() {
  return useContext(KanbanDrawerContext);
}