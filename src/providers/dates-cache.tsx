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

const DatesCacheContext = createContext<DatesCacheContext>({
  state: {
    _fromDate: new Date(),
    _toDate: new Date(),
    _dueDate: new Date()
  },
  Dispatch: undefined
});

export function DatesCacheProvider ({ children }: { children: any }) {
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