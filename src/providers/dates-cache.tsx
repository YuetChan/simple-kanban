import React, { useMemo, useReducer, createContext, useContext  } from 'react';
import { initialState, DatesCacheReducer } from '../stores/dates-cache-reducer';

interface DatesCacheContext {
  state: {
    _fromDate: Date,
    _toDate: Date,
    _dueDate: Date
  },
  Dispatch: any
}

const DatesCacheContext = createContext<DatesCacheContext>();

export function KanbanDatesProvider ({ children }) {
  const [ state, Dispatch ] = useReducer(DatesCacheReducer, initialState);

  const contextValue = useMemo(() => {
    return { state, Dispatch };
  }, [ state, Dispatch ]);

  return (
    <DatesCacheContext.Provider value={ contextValue }>
      { children }
    </DatesCacheContext.Provider>
  );
}

export function useDatesCacheContext() {
  return useContext(DatesCacheContext);
}