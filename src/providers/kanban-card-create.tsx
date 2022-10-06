import React, { useMemo, useReducer, createContext, useContext  } from 'react';
import { Task } from '../features/Task';
import { initialState, CardCreateReducer } from '../stores/kanban-card-create-reducer';

interface CardCreateContext {
  state: {
    _tagsEditAreaFocused: boolean,
    _tagsEditAreaSearchStr: string,
    _activeTags: Array<string>,
    _tagsEditAreaRef: any,
  
    _task: Task,
  
    _searchResultPanelMouseOver: boolean,
    _lastFocusedArea: string
  },
  Dispatch: any
}

const KanbanCardCreateContext = createContext<CardCreateContext>();

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