import React, { useMemo, useReducer, createContext, useContext  } from 'react';
import { initialState, TasksSearchReducer } from '../stores/tasks-search-reducer';

interface TasksSearchContext {
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

const TasksSearchContext = createContext<TasksSearchContext>({
  state: {
    _activeTab: 'kanban',

    _tagsEditAreaFocused: false,
    _tagsEditAreaRef: undefined,
    _tagsEditAreaSearchStr: '',
    _activeTags: [],
  
    _activePriority: 'low',
  
    _activeUserEmails: []
  },
  Dispatch: undefined
});

export function TasksSearchProvider ({ children }: { children: any }) {
  const [ state, Dispatch ] = useReducer(TasksSearchReducer, initialState);

  const contextValue = useMemo(() => {
    return { state, Dispatch };
  }, [ state, Dispatch ]);

  return (
    <TasksSearchContext.Provider value={ contextValue }>
      { children }
    </TasksSearchContext.Provider>
  );
}

export function useTasksSearchContext() {
  return useContext(TasksSearchContext);
}