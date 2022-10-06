import React, { useMemo, useReducer, createContext, useContext  } from 'react';
import { Task } from '../features/Task';
import { initialState, TaskUpdateReducer } from '../stores/task-update-reducer';

interface TaskUpdateContext {
  state: {
    _tagsEditAreaFocused: boolean,
    _tagsEditAreaSearchStr: string,
    // _activeTags: [],
    _tagsEditAreaRef: any,
  
    _task: Task,
  
    _searchResultPanelMouseOver: boolean,
    _lastFocusedArea: string
  },
  Dispatch: any
}

const TaskUpdateContext = createContext<TaskUpdateContext>();

export function TaskUpdateProvider ({ children }) {
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