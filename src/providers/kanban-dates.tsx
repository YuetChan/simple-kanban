import React, { useMemo, useReducer, createContext, useContext  } from 'react';
import { initialState, DateReducer } from '../stores/kanban-dates-reducer';

interface DatesContext {
  state: {
    _fromDate: Date,
    _toDate: Date,
    _dueDate: Date
  },
  Dispatch: any
}

const KanbanDatesContext = createContext<DatesContext>();

export function KanbanDatesProvider ({ children }) {
  const [ state, Dispatch ] = useReducer(DateReducer, initialState);

  const contextValue = useMemo(() => {
    return { state, Dispatch };
  }, [ state, Dispatch ]);

  return (
    <KanbanDatesContext.Provider value={ contextValue }>
      { children }
    </KanbanDatesContext.Provider>
  );
}

export function useKanbanDatesContext() {
  return useContext(KanbanDatesContext);
}