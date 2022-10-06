import React, { useMemo, useReducer, createContext, useContext  } from 'react';
import { initialState, DrawerReducer } from '../stores/kanban-drawer-reducer';

interface DrawerContext {
  state: {
    _activeTab: string,

    _tagsEditAreaFocused: boolean,
    _tagsEditAreaRef: any,
    _tagsEditAreaSearchStr: string,
    _activeTags: Array<string>,
  
    _activePriority: string,
  
    _activeUserEmails: Array<string>
  },
  Dispatch: any
}

const KanbanDrawerContext = createContext<DrawerContext>();

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