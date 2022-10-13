import React, { useMemo, useReducer, createContext, useContext  } from 'react';

import { Task } from '../types/Task';

import { initialState, TaskUpdateReducer } from '../stores/task-update-reducer';

interface TaskUpdateContext {
  state: {
    _tagsEditAreaFocused: boolean,
    _tagsEditAreaSearchStr: string,

    _tagsEditAreaRef: any,
  
    _task: Task | undefined,
  
    _searchResultPanelMouseOver: boolean,
    _lastFocusedArea: string
  },
  Dispatch: any
}

const TaskUpdateContext = createContext<TaskUpdateContext>({
  state: {
    _tagsEditAreaFocused: false,
    _tagsEditAreaSearchStr: '',

    _tagsEditAreaRef: undefined,
  
    _task: undefined,
  
    _searchResultPanelMouseOver: false,
    _lastFocusedArea: ''
  },
  Dispatch: undefined
});

export function TaskUpdateProvider ({ children }: { children: any }) {
  const [ state, Dispatch ] = useReducer(TaskUpdateReducer, initialState);

  const contextValue = useMemo(() => {
    return { state, Dispatch };
  }, [ state, Dispatch ]);

  return (
    <TaskUpdateContext.Provider value={ contextValue }>
      { children }
    </TaskUpdateContext.Provider>
  );
}

export function useTaskUpdateContext() {
  return useContext(TaskUpdateContext);
}