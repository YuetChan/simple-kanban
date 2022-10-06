import React, { useMemo, useReducer, createContext, useContext  } from 'react';

import { initialState, TaskCreateReducer } from '../stores/task-create-reducer';

import { Task } from '../features/Task';

interface TaskCreateContext {
  state: {
    _tagsEditAreaFocused: boolean,
    _tagsEditAreaSearchStr: string,
    _tagsEditAreaRef: any,

    _activeTags: Array<string>,
  
    _task: Task,
  
    _searchResultPanelMouseOver: boolean,
    _lastFocusedArea: string
  },
  Dispatch: any
}

const TaskCreateContext = createContext<TaskCreateContext>();

export function TaskCreateProvider ({ children }) {
  const [ state, Dispatch ] = useReducer(TaskCreateReducer, initialState);

  const contextValue = useMemo(() => {
    return { state, Dispatch };
  }, [ state, Dispatch ]);

  return (
    <TaskCreateContext.Provider value={ contextValue }>
      { children }
    </TaskCreateContext.Provider>
  );
}

export function useTaskCreateContext() {
  return useContext(TaskCreateContext);
}